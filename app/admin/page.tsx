import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/auth-context';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
	title: 'Acess | Personal Blog',
	description: 'Acess to your account',
};

export default async function SignInPage() {
	// Só pode ter um autor
	const count = await prisma.user.count();
	const exists = count > 0;

	return (
		<AuthProvider>
			<main className="container mx-auto px-4 py-16">
				<div className="max-w-md mx-auto">{exists ? <SignInForm /> : <SignUpForm />}</div>
			</main>
		</AuthProvider>
	);
}
