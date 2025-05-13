import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Blog Pessoal',
	description: 'Um blog pessoal construído com Next.js',
	authors: [{ name: 'John Doe' }],
	openGraph: {
		type: 'website',
		locale: 'pt-br',
		url: 'https://personal-blog.vercel.app',
		title: 'Blog Pessoal',
		description: 'Um blog pessoal construído com Next.js',
		siteName: 'Blog Pessoal',
	},
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const hideFooter = (await headers()).get('x-url')?.includes('/admin');

	return (
		<html
			lang="pt-br"
			suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<div className="flex min-h-screen flex-col">
						<Header />
						<div className="flex-1 flex">{children}</div>
						{hideFooter ? <></> : <Footer />}
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
