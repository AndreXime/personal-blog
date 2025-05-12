import type { Metadata } from 'next';
import { PostCard } from '@/components/posts/post-card';
import { SearchBar } from '@/components/common/search-bar';
import { CategoryFilter } from '@/components/posts/category-filter';
import { Pagination } from '@/components/layout/pagination';
import { getAllPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';

export const metadata: Metadata = {
	title: 'Blog | Personal Blog',
	description: 'Read all blog posts',
};

export default async function BlogPage() {
	const posts = await getAllPosts();
	const categories = await getAllCategories();

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
					<h1 className="text-4xl font-bold">Blog</h1>
					<SearchBar />
				</div>

				<div className="mb-8">
					<CategoryFilter categories={categories} />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					{posts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
						/>
					))}
				</div>

				{posts.length > 10 && (
					<Pagination
						currentPage={1}
						totalPages={Math.ceil(posts.length / 10)}
					/>
				)}
			</div>
		</main>
	);
}
