'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();

	const routes = [
		{ href: '/', label: 'Inicio' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'Sobre' },
	];

	const isActive = (path: string) => {
		if (path === '/' && pathname !== '/') {
			return false;
		}
		return pathname.startsWith(path);
	};

	return (
		<header className="border-b sticky top-0 z-40 bg-background">
			<div className="container mx-auto px-4">
				<div className="flex relative h-16 items-center justify-between">
					<div className="flex items-center gap-2">
						<Link
							href="/"
							className="font-bold text-xl">
							Personal Blog
						</Link>
					</div>

					<nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
						{routes.map((route) => (
							<Link
								key={route.href}
								href={route.href}
								className={`text-sm font-medium transition-colors hover:text-primary ${
									isActive(route.href) ? 'text-primary' : 'text-muted-foreground'
								}`}>
								{route.label}
							</Link>
						))}
					</nav>

					<div className="hidden md:flex items-center gap-2">
						<ThemeToggle />
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</div>
			</div>

			{isMenuOpen && (
				<div className="fixed inset-0 z-50 bg-background md:hidden">
					<div className="container mx-auto px-4">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center gap-2">
								<Link
									href="/"
									className="font-bold text-xl">
									Personal Blog
								</Link>
							</div>

							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsMenuOpen(false)}>
								<X className="h-5 w-5" />
								<span className="sr-only">Close menu</span>
							</Button>
						</div>

						<nav className="flex flex-col gap-4 py-8">
							{routes.map((route) => (
								<Link
									key={route.href}
									href={route.href}
									className={`text-lg font-medium transition-colors hover:text-primary ${
										isActive(route.href) ? 'text-primary' : 'text-muted-foreground'
									}`}
									onClick={() => setIsMenuOpen(false)}>
									{route.label}
								</Link>
							))}
							<div className="flex flex-col gap-2 mt-4">
								<ThemeToggle />
							</div>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
