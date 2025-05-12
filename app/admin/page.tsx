import type { Metadata } from 'next';
import AcessPage from './pageClient';
import { AuthProvider } from '@/lib/auth/auth-context';
import { TabProvider } from '@/components/auth/tab-context';

export const metadata: Metadata = {
	title: 'Acess | Personal Blog',
	description: 'Acess to your account',
};

export default function SignInPage() {
	return (
		<AuthProvider>
			<TabProvider>
				<AcessPage />
			</TabProvider>
		</AuthProvider>
	);
}
