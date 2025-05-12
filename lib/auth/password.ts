import { hash, verify } from 'argon2';

/**
 * Hash a password
 */
export async function hashPassword(password: string) {
	return await hash(password);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string) {
	return await verify(hashedPassword, password);
}
