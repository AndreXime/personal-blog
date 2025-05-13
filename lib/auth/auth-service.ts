import { prisma } from '../../lib/prisma';
import { hashPassword, verifyPassword } from '../../lib/auth/password';
import { generateToken, verifyToken } from '../../lib/auth/jwt';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

// Cookie name for storing the auth token
const AUTH_COOKIE = 'auth_token';

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	maxAge: 7 * 24 * 60 * 60, // 7 days
	path: '/',
};

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string, name?: string) {
	// Ensure only one user can be registered
	const userCount = await prisma.user.count();
	if (userCount >= 1) {
		throw new Error('User already exists');
	}

	// Check if user already exists
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		throw new Error('User already exists');
	}

	// Hash the password
	const hashedPassword = await hashPassword(password);

	// Generate verification token
	const verificationToken = uuidv4();

	// Create the user
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name: name || email.split('@')[0],
			verificationToken,
		},
	});

	// Remove sensitive data
	const { password: _, ...userWithoutPassword } = user;
	void _;
	return {
		user: userWithoutPassword,
		verificationToken,
	};
}

/**
 * Login a user
 */
export async function loginUser(email: string, password: string) {
	// Find the user
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user || !user.password) {
		throw new Error('Invalid credentials');
	}

	// Verify the password
	const isPasswordValid = await verifyPassword(password, user.password);

	if (!isPasswordValid) {
		throw new Error('Invalid credentials');
	}

	// Generate a token
	const token = await generateToken({
		id: user.id,
		email: user.email,
		role: user.role,
	});

	// Create a session
	await prisma.session.create({
		data: {
			userId: user.id,
			token,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		},
	});

	// Set the cookie
	(await cookies()).set(AUTH_COOKIE, token, COOKIE_OPTIONS);

	// Remove sensitive data
	const { password: _, ...userWithoutPassword } = user;
	void _;

	return userWithoutPassword;
}

/**
 * Logout a user
 */
export async function logoutUser() {
	const cookie = await cookies();
	const token = cookie.get(AUTH_COOKIE)?.value;

	if (token) {
		// Delete the session
		await prisma.session.deleteMany({ where: { token } });

		cookie.delete(AUTH_COOKIE);
	}
}

/**
 * Get the current user from the cookie
 */
export async function getCurrentUser() {
	const token = (await cookies()).get(AUTH_COOKIE)?.value;

	if (!token) {
		return null;
	}

	// Verify the token
	const payload = await verifyToken(token);

	if (!payload || !payload.id) {
		return null;
	}

	// Find the user
	const user = await prisma.user.findUnique({
		where: { id: payload.id },
	});

	if (!user) {
		return null;
	}

	// Remove sensitive data
	const { password, ...userWithoutPassword } = user;
	void password;
	return userWithoutPassword;
}

/**
 * Request a password reset
 */
export async function requestPasswordReset(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error('User not found');
	}

	// Generate a reset token
	const resetToken = uuidv4();
	const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

	// Update the user
	await prisma.user.update({
		where: { id: user.id },
		data: {
			resetToken,
			resetTokenExpiry,
		},
	});

	return resetToken;
}

/**
 * Reset a password
 */
export async function resetPassword(token: string, newPassword: string) {
	const user = await prisma.user.findFirst({
		where: {
			resetToken: token,
			resetTokenExpiry: {
				gt: new Date(),
			},
		},
	});

	if (!user) {
		throw new Error('Invalid or expired token');
	}

	// Hash the new password
	const hashedPassword = await hashPassword(newPassword);

	// Update the user
	await prisma.user.update({
		where: { id: user.id },
		data: {
			password: hashedPassword,
			resetToken: null,
			resetTokenExpiry: null,
		},
	});
}

/**
 * Verify a user's email
 */
export async function verifyEmail(token: string) {
	const user = await prisma.user.findFirst({
		where: {
			verificationToken: token,
		},
	});

	if (!user) {
		throw new Error('Invalid token');
	}

	// Update the user
	await prisma.user.update({
		where: { id: user.id },
		data: {
			emailVerified: true,
			verificationToken: null,
		},
	});
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(userId: string, data: Prisma.UserUpdateInput) {
	return prisma.user.update({
		where: { id: userId },
		data,
	});
}

/**
 * Change a user's password
 */
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user || !user.password) {
		throw new Error('User not found');
	}

	// Verify the current password
	const isPasswordValid = await verifyPassword(currentPassword, user.password);

	if (!isPasswordValid) {
		throw new Error('Current password is incorrect');
	}

	// Hash the new password
	const hashedPassword = await hashPassword(newPassword);

	// Update the user
	await prisma.user.update({
		where: { id: user.id },
		data: {
			password: hashedPassword,
		},
	});
}
