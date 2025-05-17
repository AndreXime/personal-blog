import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertHtmlToMarkdown, convertMarkdownToHtml, getErrorMessage } from '@/lib/utils';

interface Params {
	params: Promise<{ postId: string }>;
}

export async function GET(request: Request, { params }: Params) {
	try {
		const { postId } = await params;
		const post = await prisma.post.findUnique({
			where: { id: postId },
			include: {
				author: true,
				categories: { include: { category: true } },
				tags: { include: { tag: true } },
			},
		});
		if (!post) {
			return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
		}
		const result = {
			...post,
			content: await convertMarkdownToHtml(post.content),
			categories: post.categories.map((pc) => pc.category),
			tags: post.tags.map((pt) => pt.tag),
		};
		return NextResponse.json({ post: result });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: Params) {
	try {
		const { postId } = await params;
		const body = await request.json();
		const { title, slug, excerpt, content, coverImage, readingTime, categories = [], tags = [] } = body;

		if (!title || !slug || !content) {
			return NextResponse.json({ error: 'Título, slug e conteúdo são obrigatórios' }, { status: 400 });
		}

		const post = await prisma.post.update({
			where: { id: postId },
			data: {
				title,
				slug,
				excerpt,
				content: convertHtmlToMarkdown(content),
				coverImage,
				readingTime,
				categories: {
					deleteMany: {},
					create: categories.map((categoryId: string) => ({ category: { connect: { id: categoryId } } })),
				},
				tags: {
					deleteMany: {},
					create: tags.map((tagId: string) => ({ tag: { connect: { id: tagId } } })),
				},
			},
			include: {
				author: true,
				categories: { include: { category: true } },
				tags: { include: { tag: true } },
			},
		});

		const result = {
			...post,
			content: await convertMarkdownToHtml(post.content),
			categories: post.categories.map((pc) => pc.category),
			tags: post.tags.map((pt) => pt.tag),
		};

		return NextResponse.json({ post: result });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		const { postId } = await params;
		await prisma.post.delete({ where: { id: postId } });
		return NextResponse.json({ message: 'Post removido com sucesso' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
