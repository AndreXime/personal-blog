import { SignJWT, jwtVerify } from 'jose';

// Secret key for JWT signing and verification
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-at-least-32-chars-long');

// Token expiration time
const TOKEN_EXPIRATION = '7d'; // 7 days

interface JwtPayload {
	id: string;
	email: string;
	role: string;
	iat: number; // emitido em (timestamp)
	exp: number; // expira em (timestamp)
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(TOKEN_EXPIRATION)
		.sign(JWT_SECRET);
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload as unknown as JwtPayload;
	} catch {
		return null;
	}
}
