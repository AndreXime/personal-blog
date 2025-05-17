'use client';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
	const pathname = usePathname();
	if (pathname.startsWith('/admin')) return null;

	return (
		<footer className="border-t py-10 mt-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2">
						<Link
							href="/"
							className="font-bold text-xl mb-4 inline-block">
							André Blog
						</Link>
						<p className="text-muted-foreground mb-4">
							Um blog pessoal sobre tecnologia, programação e dicas do dia a dia.
						</p>
						<div className="flex space-x-4">
							<Link
								href="https://github.com"
								className="text-muted-foreground hover:text-foreground">
								<Github className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</Link>
							<Link
								href="https://twitter.com"
								className="text-muted-foreground hover:text-foreground">
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</Link>
							<Link
								href="https://linkedin.com"
								className="text-muted-foreground hover:text-foreground">
								<Linkedin className="h-5 w-5" />
								<span className="sr-only">LinkedIn</span>
							</Link>
						</div>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Navegação</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-muted-foreground hover:text-foreground">
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-muted-foreground hover:text-foreground">
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-muted-foreground hover:text-foreground">
									Sobre
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
