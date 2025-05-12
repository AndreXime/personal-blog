import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function middleware(req: NextRequest) {
	const token = req.cookies.get('auth_token')?.value;
	const path = req.nextUrl.pathname;

	// Protected routes that require authentication
	const protectedRoutes = ['/admin/panel'];

	// Authentication routes that should redirect to home if already logged in
	const authRoutes = ['/admin'];

	// For protected routes, check if user is authenticated
	if (protectedRoutes.some((route) => path.startsWith(route))) {
		if (!token) {
			const redirectUrl = new URL('/admin', req.url);
			redirectUrl.searchParams.set('redirect', path);
			return NextResponse.redirect(redirectUrl);
		}

		// Verify the token
		const payload = await verifyToken(token);
		if (!payload) {
			const redirectUrl = new URL('/admin', req.url);
			redirectUrl.searchParams.set('redirect', path);
			return NextResponse.redirect(redirectUrl);
		}

		if (path.startsWith('/admin/panel') && payload.role !== 'admin') {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}

	// For auth routes, redirect to home if already authenticated
	if (authRoutes.includes(path) && token) {
		const payload = await verifyToken(token);
		if (payload) {
			return NextResponse.redirect(new URL('/admin/panel', req.url));
		}
	}

	return NextResponse.next({ headers: { 'x-url': req.nextUrl.href } });
}

export const config = {
	matcher: ['/admin', '/admin/panel', '/admin/panel/:path*'],
};
