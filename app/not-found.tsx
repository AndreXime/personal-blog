import Link from 'next/link';

export default function NotFound() {
	return (
		<main className="container mx-auto px-4 py-16 text-center">
			<h1 className="text-6xl font-bold mb-6">404</h1>
			<h2 className="text-2xl font-semibold mb-4">Página Não Encontrada</h2>
			<p className="text-muted-foreground mb-8 max-w-md mx-auto">
				A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente
				indisponível.
			</p>
			<Link
				href="/"
				className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
				Voltar para Home
			</Link>
		</main>
	);
}
