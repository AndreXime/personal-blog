import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth-service';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { AuthProvider } from '@/lib/auth/auth-context';

export const metadata = {
	title: 'Dashboard | Personal Blog',
	description: 'Manage your profile, posts, categories, and tags',
};

export default async function DashboardPage() {
	const user = await getCurrentUser();

	if (!user || user.role != 'admin') {
		redirect('/admin');
	}

	return (
		<AuthProvider User={user}>
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
					<DashboardTabs />
				</div>
			</main>
		</AuthProvider>
	);
}
