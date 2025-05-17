import { prisma } from '@/lib/prisma';
import type { PostWithRelations } from '@/lib/types';
import { convertMarkdownToHtml } from './utils';

export async function getAllPosts(): Promise<PostWithRelations[]> {
	const posts = await prisma.post.findMany({
		where: {
			published: true,
		},
		include: {
			author: true,
			categories: {
				include: {
					category: true,
				},
			},
			tags: {
				include: {
					tag: true,
				},
			},
		},
		orderBy: {
			publishedAt: 'desc',
		},
	});

	return await Promise.all(
		posts.map(async (post) => ({
			...post,
			content: await convertMarkdownToHtml(post.content),
			categories: post.categories.map((pc) => pc.category),
			tags: post.tags.map((pt) => pt.tag),
		}))
	);
}

export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
	const post = await prisma.post.findUnique({
		where: {
			slug,
			published: true,
		},
		include: {
			author: true,
			categories: {
				include: {
					category: true,
				},
			},
			tags: {
				include: {
					tag: true,
				},
			},
		},
	});

	if (!post) {
		return null;
	}

	// Increment view count
	await prisma.postView.create({
		data: {
			postId: post.id,
		},
	});

	return {
		...post,
		content: await convertMarkdownToHtml(post.content),
		categories: post.categories.map((pc) => pc.category),
		tags: post.tags.map((pt) => pt.tag),
	};
}

export async function getPostsByCategory(categorySlug: string): Promise<PostWithRelations[]> {
	const category = await prisma.category.findUnique({
		where: {
			slug: categorySlug,
		},
	});

	if (!category) {
		return [];
	}

	const posts = await prisma.post.findMany({
		where: {
			published: true,
			categories: {
				some: {
					categoryId: category.id,
				},
			},
		},
		include: {
			author: true,
			categories: {
				include: {
					category: true,
				},
			},
			tags: {
				include: {
					tag: true,
				},
			},
		},
		orderBy: {
			publishedAt: 'desc',
		},
	});

	return posts.map((post) => ({
		...post,
		categories: post.categories.map((pc) => pc.category),
		tags: post.tags.map((pt) => pt.tag),
	}));
}

export async function getPostsByTag(tagSlug: string): Promise<PostWithRelations[]> {
	const tag = await prisma.tag.findUnique({
		where: {
			slug: tagSlug,
		},
	});

	if (!tag) {
		return [];
	}

	const posts = await prisma.post.findMany({
		where: {
			published: true,
			tags: {
				some: {
					tagId: tag.id,
				},
			},
		},
		include: {
			author: true,
			categories: {
				include: {
					category: true,
				},
			},
			tags: {
				include: {
					tag: true,
				},
			},
		},
		orderBy: {
			publishedAt: 'desc',
		},
	});

	return posts.map((post) => ({
		...post,
		categories: post.categories.map((pc) => pc.category),
		tags: post.tags.map((pt) => pt.tag),
	}));
}

export async function searchPosts(query: string): Promise<PostWithRelations[]> {
	const posts = await prisma.post.findMany({
		where: {
			published: true,
			OR: [
				{
					title: {
						contains: query,
						mode: 'insensitive',
					},
				},
				{
					content: {
						contains: query,
						mode: 'insensitive',
					},
				},
				{
					excerpt: {
						contains: query,
						mode: 'insensitive',
					},
				},
			],
		},
		include: {
			author: true,
			categories: {
				include: {
					category: true,
				},
			},
			tags: {
				include: {
					tag: true,
				},
			},
		},
		orderBy: {
			publishedAt: 'desc',
		},
	});

	return posts.map((post) => ({
		...post,
		categories: post.categories.map((pc) => pc.category),
		tags: post.tags.map((pt) => pt.tag),
	}));
}
