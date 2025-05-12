import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag } from 'lucide-react';

import { ShareButtons } from '@/components/posts/share-buttons';
import { getPostBySlug, getAllPosts } from '@/lib/posts';

type PostPageProps = {
	params: Promise<{ [key: string]: string }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
	const post = await getPostBySlug((await params).slug);

	if (!post) {
		return {
			title: 'Post Not Found',
			description: "The post you're looking for doesn't exist",
		};
	}

	return {
		title: `${post.title} | Personal Blog`,
		description: post.excerpt || undefined,
		authors: post.author?.name ? { name: post.author.name } : undefined,
		openGraph: {
			title: post.title,
			description: post.excerpt || undefined,
			type: 'article',
			publishedTime: String(post.publishedAt) || undefined,
			authors: post.author ? post.author.name : undefined,
			tags: post.tags?.map((tag) => tag.name),
		},
	};
}

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export default async function PostPage({ params }: PostPageProps) {
	const post = await getPostBySlug((await params).slug);

	if (!post) {
		notFound();
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<article className="max-w-3xl mx-auto">
				<header className="mb-8">
					<h1 className="text-4xl font-bold mb-4">{post.title}</h1>

					<div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
						<div className="flex items-center">
							<Calendar className="mr-2 h-4 w-4" />
							<time dateTime={String(post.publishedAt) || String(post.createdAt)}>
								{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</time>
						</div>
						<div className="flex items-center">
							<Clock className="mr-2 h-4 w-4" />
							<span>{post.readingTime} min read</span>
						</div>
					</div>

					<div className="mb-6">
						<Image
							src={post.coverImage || '/placeholder.svg?height=600&width=1200'}
							alt={post.title}
							width={1200}
							height={600}
							className="rounded-lg object-cover w-full aspect-video"
						/>
					</div>
				</header>

				<div
					className="prose max-w-none dark:prose-invert mb-8"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				<footer>
					<div className="flex flex-wrap gap-2 mb-8">
						{post.tags?.map((tag) => (
							<Link
								key={tag.id}
								href={`/tag/${tag.slug}`}
								className="flex items-center px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-sm">
								<Tag className="mr-1 h-3 w-3" />
								{tag.name}
							</Link>
						))}
					</div>

					<ShareButtons
						title={post.title}
						slug={post.slug}
					/>

					<div className="border-t border-b py-8 my-8">
						<div className="flex items-center gap-4">
							<Image
								src={post.author?.avatarUrl || '/placeholder.svg?height=80&width=80'}
								alt={post.author?.name || 'Author'}
								width={80}
								height={80}
								className="rounded-full"
							/>
							<div>
								<h3 className="font-semibold">{post.author?.name || 'Anonymous'}</h3>
								<p className="text-muted-foreground text-sm">{post.author?.bio || 'Writer and content creator.'}</p>
							</div>
						</div>
					</div>
				</footer>
			</article>
		</main>
	);
}
