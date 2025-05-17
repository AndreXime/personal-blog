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
	description: 'Um blog pessoal',
	authors: [{ name: 'André Ximenes' }],
	openGraph: {
		type: 'website',
		locale: 'pt-br',
		url: 'https://personal-blog.vercel.app',
		title: 'Blog Pessoal',
		description: 'Um blog pessoal',
		siteName: 'Blog Pessoal',
	},
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="pt-br"
			suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					enableSystem
					disableTransitionOnChange>
					<div className="flex min-h-screen flex-col">
						<Header />
						<div className="flex-1 flex">{children}</div>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
