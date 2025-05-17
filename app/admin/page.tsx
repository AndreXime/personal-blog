import type { Metadata } from 'next';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/auth-service';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Acess | Personal Blog',
	description: 'Acess to your account',
};

export default async function SignInPage() {
	const user = await getCurrentUser();

	if (user) {
		redirect('/admin/panel');
	}

	// Só pode ter um autor
	const count = await prisma.user.count();
	const exists = count > 0;

	return (
		<main className="container mx-auto px-4 py-16">
			<div className="max-w-md mx-auto">{exists ? <SignInForm /> : <SignUpForm />}</div>
		</main>
	);
}
