import Image from 'next/image';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const metadata = {
	title: 'Sobre Mim | Blog Pessoal',
	description: 'Saiba mais sobre o autor deste blog',
};

export default function AboutPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">Sobre Mim</h1>

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
						<p className="text-muted-foreground mb-4">Escritor, desenvolvedor e entusiasta de tecnologia</p>

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
						Olá! Eu sou John, um escritor e desenvolvedor apaixonado com mais de 10 anos de experiência na indústria de
						tecnologia. Criei este blog para compartilhar meus pensamentos, experiências e conhecimento com o mundo.
					</p>

					<p>
						Minha jornada começou quando descobri a programação na faculdade. Desde então, trabalhei com várias
						tecnologias e frameworks, sempre ansioso para aprender e explorar novas possibilidades. Tenho particular
						interesse em desenvolvimento web, inteligência artificial e como a tecnologia pode melhorar nossa vida
						diária.
					</p>

					<p>
						Quando não estou programando ou escrevendo, você pode me encontrar caminhando nas montanhas, lendo ficção
						científica ou experimentando novas receitas na cozinha. Acredito no aprendizado contínuo e no crescimento
						pessoal, e espero que meu blog inspire você a perseguir suas próprias paixões.
					</p>

					<p>
						Sinta-se à vontade para entrar em contato se tiver alguma dúvida, sugestão ou apenas queira conversar. Estou
						sempre aberto a conversas interessantes e novas oportunidades.
					</p>
				</div>
			</div>
		</main>
	);
}
