import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const { email, password, name } = await request.json();

		if (!email || !password) {
			return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
		}

		const { user, verificationToken } = await registerUser(email, password, name);

		// In a real application, you would send a verification email here
		console.log(`Verification token for ${email}: ${verificationToken}`);

		return NextResponse.json({
			user,
			message: 'Registro realizado com sucesso! Por favor, verifique seu email para confirmar sua conta.',
		});
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
