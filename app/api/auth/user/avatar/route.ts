import { NextResponse } from 'next/server';
import { getCurrentUser, updateUserProfile } from '@/lib/auth/auth-service';

export async function POST(request: Request) {
	// Get the current user
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
	}

	// Parse form data
	const formData = await request.formData();
	const file = formData.get('avatar');
	if (!file || typeof (file as Blob).arrayBuffer !== 'function') {
		return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
	}

	// Read file buffer and convert to base64
	const blob = file as Blob;
	const buffer = Buffer.from(await blob.arrayBuffer());
	const mimeType = blob.type; // e.g. 'image/png'
	const base64 = buffer.toString('base64');
	const dataUrl = `data:${mimeType};base64,${base64}`;
	const updatedUser = await updateUserProfile(user.id, { avatarUrl: dataUrl });

	return NextResponse.json({ avatarUrl: updatedUser.avatarUrl });
}
