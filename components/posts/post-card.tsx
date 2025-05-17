import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import type { PostWithRelations } from '@/lib/types';

interface PostCardProps {
	post: PostWithRelations;
	featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
	return (
		<article className={`overflow-hidden rounded-lg border ${featured ? 'md:grid md:grid-cols-2 gap-6' : ''}`}>
			<Link
				href={`/blog/${post.slug}`}
				className="block overflow-hidden">
				<Image
					src={post.coverImage ? `/api/${post.coverImage}` : '/placeholder.svg?height=600&width=1200'}
					alt={post.title}
					width={800}
					height={400}
					className={`object-cover w-full transition-transform duration-300 hover:scale-105 ${
						featured ? 'aspect-video md:h-full' : 'aspect-video'
					}`}
				/>
			</Link>

			<div className="p-6">
				<div className="flex flex-wrap gap-2 mb-3">
					{post.categories?.map((category) => (
						<Link
							key={category.id}
							href={`/category/${category.slug}`}
							className="text-xs font-medium text-primary hover:underline">
							{category.name}
						</Link>
					))}
				</div>

				<h2 className={`font-bold mb-2 line-clamp-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
					<Link
						href={`/blog/${post.slug}`}
						className="hover:underline">
						{post.title}
					</Link>
				</h2>

				<p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

				<div className="flex items-center text-sm text-muted-foreground">
					<div className="flex items-center mr-4">
						<Calendar className="mr-1 h-4 w-4" />
						<time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
							{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							})}
						</time>
					</div>

					<div className="flex items-center">
						<Clock className="mr-1 h-4 w-4" />
						<span>{post.readingTime} min read</span>
					</div>
				</div>
			</div>
		</article>
	);
}
