import type { Metadata } from 'next';
import { PostCard } from '@/components/posts/post-card';
import { SearchBar } from '@/components/common/search-bar';
import { searchPosts } from '@/lib/posts';

export const metadata: Metadata = {
	title: 'Resultados da Busca | Blog Pessoal',
	description: 'Resultados da busca para sua consulta',
};

interface SearchPageProps {
	searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const query = (await searchParams).q || '';
	const posts = query ? await searchPosts(query) : [];

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
					<h1 className="text-4xl font-bold">Resultados da Busca</h1>
					<SearchBar initialQuery={query} />
				</div>

				<p className="mb-8 text-muted-foreground">
					{query === ''
						? 'Digite um termo para buscar posts'
						: posts.length === 0
						? `Nenhum resultado encontrado para "${query}"`
						: `Encontrado(s) ${posts.length} resultado(s) para "${query}"`}
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
					query !== '' && (
						<div className="text-center py-12">
							<p className="text-lg mb-4">Nenhum post encontrado com seus critérios de busca.</p>
							<p>Tente usar palavras-chave diferentes ou navegue pelas nossas categorias.</p>
						</div>
					)
				)}
			</div>
		</main>
	);
}
