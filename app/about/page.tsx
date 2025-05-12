import Image from 'next/image';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const metadata = {
	title: 'About Me | Personal Blog',
	description: 'Learn more about the author of this blog',
};

export default function AboutPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">About Me</h1>

				<div className="flex flex-col md:flex-row gap-8 mb-10">
					<div className="md:w-1/3">
						<Image
							src="/placeholder.svg?height=300&width=300"
							alt="Author"
							width={300}
							height={300}
							className="rounded-lg object-cover"
						/>
					</div>

					<div className="md:w-2/3">
						<h2 className="text-2xl font-semibold mb-4">John Doe</h2>
						<p className="text-muted-foreground mb-4">Writer, developer, and technology enthusiast</p>

						<div className="flex space-x-4 mb-6">
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
							<Link
								href="mailto:hello@example.com"
								className="text-muted-foreground hover:text-foreground">
								<Mail className="h-5 w-5" />
								<span className="sr-only">Email</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="prose max-w-none dark:prose-invert">
					<p>
						Hello! I&apos;m John, a passionate writer and developer with over 10 years of experience in the tech
						industry. I created this blog to share my thoughts, experiences, and knowledge with the world.
					</p>

					<p>
						My journey began when I first discovered programming in college. Since then, I&apos;ve worked with various
						technologies and frameworks, always eager to learn and explore new possibilities. I&apos;m particularly
						interested in web development, artificial intelligence, and how technology can improve our daily lives.
					</p>

					<p>
						When I&apos;m not coding or writing, you can find me hiking in the mountains, reading science fiction, or
						experimenting with new recipes in the kitchen. I believe in continuous learning and personal growth, and I
						hope my blog inspires you to pursue your own passions.
					</p>

					<p>
						Feel free to reach out if you have any questions, suggestions, or just want to connect. I&apos;m always open
						to interesting conversations and new opportunities.
					</p>
				</div>
			</div>
		</main>
	);
}
