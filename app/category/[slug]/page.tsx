import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/posts/post-card';
import { SearchBar } from '@/components/common/search-bar';
import { getPostsByCategory } from '@/lib/posts';
import { getCategoryBySlug } from '@/lib/categories';

type PageProps = {
	params: Promise<{ [key: string]: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const category = await getCategoryBySlug((await params).slug);

	if (!category) {
		return {
			title: 'Categoria Não Encontrada',
			description: 'A categoria que você está procurando não existe',
		};
	}

	return {
		title: `${category.name} | Blog Pessoal`,
		description: category.description || `Navegue por todos os posts na categoria ${category.name}`,
	};
}

export default async function CategoryPage({ params }: PageProps) {
	const category = await getCategoryBySlug((await params).slug);

	if (!category) {
		notFound();
	}

	const posts = await getPostsByCategory((await params).slug);

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
					<h1 className="text-4xl font-bold">Categoria: {category.name}</h1>
					<SearchBar />
				</div>

				{category.description && <p className="text-muted-foreground mb-8">{category.description}</p>}

				<p className="mb-8 text-muted-foreground">
					Visualizando {posts.length} post{posts.length === 1 ? '' : 's'} na categoria {category.name}
				</p>

				{posts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
						{posts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-lg mb-4">Nenhum post encontrado nesta categoria.</p>
						<p>Volte mais tarde para conferir novos conteúdos.</p>
					</div>
				)}
			</div>
		</main>
	);
}
