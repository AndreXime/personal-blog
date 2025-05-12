import { NextResponse } from 'next/server';
import { getCurrentUser, changePassword } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const { currentPassword, newPassword } = await request.json();

		if (!currentPassword || !newPassword) {
			return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
		}

		await changePassword(user.id, currentPassword, newPassword);

		return NextResponse.json({ message: 'Password changed successfully' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
