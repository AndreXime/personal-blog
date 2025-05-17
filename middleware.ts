import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (!pathname.includes('auth') && pathname.startsWith('/api') && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
		const token = req.cookies.get('auth_token')?.value;
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const payload = await verifyToken(token);
		if (!payload || payload.role !== 'admin') {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin', '/admin/panel', '/api/:path*'],
};
