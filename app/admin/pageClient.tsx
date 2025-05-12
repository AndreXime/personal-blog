'use client';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { useTab } from '@/components/auth/tab-context';

export default function AcessPage() {
	const { Tab } = useTab();

	const ActiveTab = () => {
		switch (Tab) {
			case 'Register':
				return <SignUpForm />;
			case 'Forgot':
				return <ForgotPasswordForm />;
			default:
				return <SignInForm />;
		}
	};
	return (
		<main className="container mx-auto px-4 py-16">
			<div className="max-w-md mx-auto">
				<ActiveTab />
			</div>
		</main>
	);
}
