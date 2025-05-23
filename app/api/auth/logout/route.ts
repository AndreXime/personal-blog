import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST() {
	try {
		await logoutUser();
		return NextResponse.json({ message: 'Logout realizado com sucesso' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
