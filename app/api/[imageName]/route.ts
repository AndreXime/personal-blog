import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ imageName: string }> }) {
	try {
		const { imageName } = await params;
		const record = await prisma.post.findFirst({
			where: { coverImage: imageName },
			select: { imageData: true },
		});
		if (!record?.imageData) {
			return new NextResponse('Not found', { status: 404 });
		}
		const extension = imageName.split('.').pop()?.toLowerCase() || '';
		const contentTypeMap: Record<string, string> = {
			png: 'image/png',
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			gif: 'image/gif',
			webp: 'image/webp',
			svg: 'image/svg+xml',
		};
		const contentType = contentTypeMap[extension] || 'application/octet-stream';
		const headers = new Headers();
		headers.set('Content-Type', contentType);
		return new NextResponse(record.imageData, { headers });
	} catch (error) {
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
