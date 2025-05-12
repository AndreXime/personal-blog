import { NextResponse } from 'next/server';
import { verifyEmail } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get('token');

		if (!token) {
			return NextResponse.json({ error: 'Token is required' }, { status: 400 });
		}

		await verifyEmail(token);

		// Redirect to login page
		return NextResponse.redirect(new URL('/admin', request.url));
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
