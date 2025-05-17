import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Sobre Mim | Blog Pessoal',
	description: 'Saiba mais sobre o autor deste blog',
};

export default async function AboutPage() {
	const author = await prisma.user.findFirst();
	if (!author) {
		redirect('/');
	}
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">Sobre Mim</h1>

				<div className="flex flex-col md:flex-row gap-8 mb-10">
					<div className="md:w-1/3">
						<Image
							src={author.avatarUrl ? `${author.avatarUrl}` : '/placeholder.svg?height=300&width=300'}
							alt="Author"
							width={300}
							height={300}
							className="rounded-lg object-cover"
						/>
					</div>

					<div className="md:w-2/3">
						<h2 className="text-2xl font-semibold mb-4">{author.name}</h2>
						<p className="text-muted-foreground mb-4">{author.jobTitle}</p>

						<div className="flex space-x-4 mb-6">
							<Link
								href="https://github.com"
								className="text-muted-foreground hover:text-foreground">
								<Github className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</Link>

							<Link
								href="https://linkedin.com"
								className="text-muted-foreground hover:text-foreground">
								<Linkedin className="h-5 w-5" />
								<span className="sr-only">LinkedIn</span>
							</Link>
							<Link
								href="mailto:hello@example.com"
								className="text-muted-foreground hover:text-foreground">
								<Mail className="h-5 w-5" />
								<span className="sr-only">Email</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="prose max-w-none dark:prose-invert">{author.bio}</div>
			</div>
		</main>
	);
}
