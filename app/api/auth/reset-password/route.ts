import { NextResponse } from 'next/server';
import { requestPasswordReset, resetPassword } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		const resetToken = await requestPasswordReset(email);

		// In a real application, you would send a reset email here
		console.log(`Reset token for ${email}: ${resetToken}`);

		return NextResponse.json({
			message: 'Password reset email sent! Please check your inbox for further instructions.',
		});
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}

export async function PUT(request: Request) {
	try {
		const { token, password } = await request.json();

		if (!token || !password) {
			return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
		}

		await resetPassword(token, password);

		return NextResponse.json({ message: 'Password reset successful! You can now log in with your new password.' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
