import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
		const { postId, content, parentId } = await request.json();

		if (!postId || !content) {
			return NextResponse.json({ success: false, message: 'ID do post e conteúdo são obrigatórios' }, { status: 400 });
		}

		// Add the comment
		const comment = await prisma.comment.create({
			data: {
				postId,
				content,
				parentId: parentId || null,
			},
			include: {
				user: true,
			},
		});

		return NextResponse.json({ success: true, comment }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
