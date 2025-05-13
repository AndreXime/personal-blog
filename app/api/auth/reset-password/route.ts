import { NextResponse } from 'next/server';
import { requestPasswordReset, resetPassword } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: 'O email é obrigatório' }, { status: 400 });
		}

		const resetToken = await requestPasswordReset(email);

		// In a real application, you would send a reset email here
		console.log(`Reset token for ${email}: ${resetToken}`);

		return NextResponse.json({
			message: 'Email de redefinição de senha enviado! Por favor, verifique sua caixa de entrada para mais instruções.',
		});
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}

export async function PUT(request: Request) {
	try {
		const { token, password } = await request.json();

		if (!token || !password) {
			return NextResponse.json({ error: 'Token e senha são obrigatórios' }, { status: 400 });
		}

		await resetPassword(token, password);

		return NextResponse.json({
			message: 'Redefinição de senha realizada com sucesso! Você já pode entrar com sua nova senha.',
		});
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
