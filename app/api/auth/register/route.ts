import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/auth-service';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const { email, password, name } = await request.json();

		if (!email || !password) {
			return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
		}

		const user = await registerUser(email, password, name);

		return NextResponse.json({
			user,
			message: 'Registro realizado com sucesso!',
		});
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
	}
}
