import { NextResponse } from 'next/server';
import { getCurrentUser, changePassword } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
		}

		const { currentPassword, newPassword } = await request.json();

		if (!currentPassword || !newPassword) {
			return NextResponse.json({ error: 'Senha atual e nova senha são obrigatórias' }, { status: 400 });
		}

		await changePassword(user.id, currentPassword, newPassword);

		return NextResponse.json({ message: 'Senha alterada com sucesso' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
