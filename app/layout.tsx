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
	title: 'Personal Blog',
	description: 'A personal blog built with Next.js',
	authors: [{ name: 'John Doe' }],
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://personal-blog.vercel.app',
		title: 'Personal Blog',
		description: 'A personal blog built with Next.js',
		siteName: 'Personal Blog',
	},
	generator: 'v0.dev',
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
