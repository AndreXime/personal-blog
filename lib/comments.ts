'use server';
import { prisma } from '@/lib/prisma';
import type { Comment } from '@prisma/client';

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
	return prisma.comment.findMany({
		where: {
			postId,
		},
		include: {
			user: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
}

export async function addComment(
	postId: string,
	userId: string | null,
	content: string,
	parentId?: string
): Promise<Comment | null> {
	return prisma.comment.create({
		data: {
			content,
			postId,
			userId,
			parentId: parentId || null,
		},
	});
}
