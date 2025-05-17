import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertHtmlToMarkdown, convertMarkdownToHtml, getErrorMessage } from '@/lib/utils';
import { Buffer } from 'buffer';
import { getCurrentUser } from '@/lib/auth/auth-service';

export async function GET() {
	try {
		const posts = await prisma.post.findMany({
			include: {
				author: true,
				categories: { include: { category: true } },
				tags: { include: { tag: true } },
			},
			orderBy: { createdAt: 'desc' },
		});

		const result = await Promise.all(
			posts.map(async (post) => ({
				...post,
				content: await convertMarkdownToHtml(post.content),
				categories: post.categories.map((pc) => pc.category),
				tags: post.tags.map((pt) => pt.tag),
			}))
		);

		return NextResponse.json({ posts: result });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const contentType = request.headers.get('content-type') || '';
		if (!contentType.includes('multipart/form-data')) {
			return NextResponse.json({ error: 'Content-Type deve ser multipart/form-data' }, { status: 400 });
		}
		const formData = await request.formData();
		const imageFile = formData.get('image') as File | null;
		if (!imageFile) {
			return NextResponse.json({ error: 'Imagem é obrigatória' }, { status: 400 });
		}
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const excerpt = formData.get('excerpt') as string | null;
		const contentStr = formData.get('content') as string;
		const coverImage = imageFile.name;
		const readingTime = parseInt(formData.get('readingTime') as string) || 0;
		const categories = JSON.parse((formData.get('categories') as string) || '[]');
		const tags = JSON.parse((formData.get('tags') as string) || '[]');

		// process image binary
		const arrayBuffer = await imageFile.arrayBuffer();
		const imageData = Buffer.from(arrayBuffer);

		if (!title || !slug || !contentStr) {
			return NextResponse.json({ error: 'Título, slug e conteúdo são obrigatórios' }, { status: 400 });
		}

		const user = await getCurrentUser();
		if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

		const post = await prisma.post.create({
			data: {
				title,
				slug,
				excerpt,
				content: convertHtmlToMarkdown(contentStr),
				coverImage,
				imageData,
				readingTime,
				categories: {
					create: categories.map((categoryId: string) => ({ category: { connect: { id: categoryId } } })),
				},
				tags: {
					create: tags.map((tagId: string) => ({ tag: { connect: { id: tagId } } })),
				},
				published: true,
				publishedAt: new Date(Date.now()),
				author: { connect: { id: user.id } },
			},
			include: {
				author: true,
				categories: { include: { category: true } },
				tags: { include: { tag: true } },
			},
		});

		const result = {
			...post,
			categories: post.categories.map((pc) => pc.category),
			tags: post.tags.map((pt) => pt.tag),
		};

		return NextResponse.json({ post: result });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
