import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PanelClient from './pageClient';
import { AuthProvider } from '@/lib/auth/auth-context';

export default async function AdminPage() {
	const token = (await cookies()).get('auth_token')?.value;
	if (!token) redirect('/admin');

	const payload = await verifyToken(token);
	if (!payload?.id) redirect('/');

	const user = await prisma.user.findUnique({
		where: { id: payload.id },
		select: { role: true },
	});

	if (user?.role !== 'admin') redirect('/');

	return (
		<AuthProvider>
			<PanelClient />
		</AuthProvider>
	);
}
