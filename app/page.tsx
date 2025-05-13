import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { PostCard } from '@/components/posts/post-card';
import { SearchBar } from '@/components/common/search-bar';
import { getAllPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';

export default async function Home() {
	const posts = await getAllPosts();
	const categories = await getAllCategories();

	const featuredPost = posts.find((post) => post.featured) || posts[0];
	const recentPosts = posts.filter((post) => post.id !== featuredPost?.id).slice(0, 4);

	return (
		<main className="container mx-auto px-4 py-8">
			<section className="mb-12">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-bold">Posts Recentes</h2>
					<SearchBar />
				</div>

				{featuredPost && (
					<div className="mb-10">
						<PostCard
							post={featuredPost}
							featured
						/>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{recentPosts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
						/>
					))}
				</div>

				<div className="mt-8 text-center">
					<Link
						href="/blog"
						className="inline-flex items-center text-primary hover:underline">
						Ver todos os posts
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="text-3xl font-bold mb-6">Categorias Populares</h2>
				<div className="flex flex-wrap gap-3">
					{categories.slice(0, 5).map((category) => (
						<Link
							key={category.id}
							href={`/category/${category.slug}`}
							className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-sm">
							{category.name}
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
