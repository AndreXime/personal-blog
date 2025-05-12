import { NextResponse } from 'next/server';
import { getCurrentUser, updateUserProfile } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		return NextResponse.json({ user });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}

export async function PUT(request: Request) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}

		const data = await request.json();
		const updatedUser = await updateUserProfile(user.id, data);

		return NextResponse.json({ user: updatedUser });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
