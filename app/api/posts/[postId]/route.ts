import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertHtmlToMarkdown, convertMarkdownToHtml, getErrorMessage } from '@/lib/utils';
import { Buffer } from 'buffer';

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
		const contentType = request.headers.get('content-type') ?? '';
		if (!contentType.includes('multipart/form-data')) {
			return NextResponse.json({ error: 'Content-Type deve ser multipart/form-data' }, { status: 400 });
		}
		const formData = await request.formData();
		const imageFile = formData.get('image') as File | null;
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const excerpt = formData.get('excerpt') as string;
		const contentStr = formData.get('content') as string;
		const readingTime = parseInt(formData.get('readingTime') as string) || 0;
		const categoriesArr = JSON.parse((formData.get('categories') as string) || '[]');
		const tagsArr = JSON.parse((formData.get('tags') as string) || '[]');

		let coverImage;
		let imageData;
		if (imageFile) {
			coverImage = imageFile.name;
			const arrayBuffer = await imageFile.arrayBuffer();
			imageData = Buffer.from(arrayBuffer);
		}

		if (!title || !slug || !contentStr) {
			return NextResponse.json({ error: 'Título, slug e conteúdo são obrigatórios' }, { status: 400 });
		}

		const post = await prisma.post.update({
			where: { id: postId },
			data: {
				title,
				slug,
				excerpt,
				content: convertHtmlToMarkdown(contentStr),
				...(imageFile && { coverImage, imageData }),
				readingTime,
				categories: {
					deleteMany: {},
					create: categoriesArr.map((categoryId: string) => ({ category: { connect: { id: categoryId } } })),
				},
				tags: {
					deleteMany: {},
					create: tagsArr.map((tagId: string) => ({ tag: { connect: { id: tagId } } })),
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
