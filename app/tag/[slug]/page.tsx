import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/posts/post-card';
import { SearchBar } from '@/components/common/search-bar';
import { getPostsByTag } from '@/lib/posts';
import { getTagBySlug } from '@/lib/tags';

interface TagPageProps {
	params: {
		slug: string;
	};
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
	const tag = await getTagBySlug(params.slug);

	if (!tag) {
		return {
			title: 'Tag Não Encontrada',
			description: 'A tag que você está procurando não existe',
		};
	}

	return {
		title: `#${tag.name} | Blog Pessoal`,
		description: `Navegue por todos os posts com a tag #${tag.name}`,
	};
}

export default async function TagPage({ params }: TagPageProps) {
	const tag = await getTagBySlug(params.slug);

	if (!tag) {
		notFound();
	}

	const posts = await getPostsByTag(params.slug);

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
					<h1 className="text-4xl font-bold">Tag: #{tag.name}</h1>
					<SearchBar />
				</div>

				<p className="mb-8 text-muted-foreground">
					Visualizando {posts.length} post{posts.length === 1 ? '' : 's'} com a tag #{tag.name}
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
						<p className="text-lg mb-4">Nenhum post encontrado com esta tag.</p>
						<p>Volte mais tarde para conferir novos conteúdos.</p>
					</div>
				)}
			</div>
		</main>
	);
}
