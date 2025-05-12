import type { Metadata } from 'next';
import { PostCard } from '@/components/posts/post-card';
import { SearchBar } from '@/components/common/search-bar';
import { searchPosts } from '@/lib/posts';

export const metadata: Metadata = {
	title: 'Search Results | Personal Blog',
	description: 'Search results for your query',
};

interface SearchPageProps {
	searchParams: { q: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const query = searchParams.q || '';
	const posts = query ? await searchPosts(query) : [];

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
					<h1 className="text-4xl font-bold">Search Results</h1>
					<SearchBar initialQuery={query} />
				</div>

				<p className="mb-8 text-muted-foreground">
					{query === ''
						? 'Enter a search term to find posts'
						: posts.length === 0
						? `No results found for "${query}"`
						: `Found ${posts.length} result${posts.length === 1 ? '' : 's'} for "${query}"`}
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
							<p className="text-lg mb-4">No posts found matching your search criteria.</p>
							<p>Try using different keywords or browse our categories.</p>
						</div>
					)
				)}
			</div>
		</main>
	);
}
