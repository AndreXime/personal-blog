import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
	try {
		const tags = await prisma.tag.findMany({ orderBy: { createdAt: 'desc' } });
		return NextResponse.json({ tags });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const { name, slug } = await request.json();
		if (!name || !slug) {
			return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 });
		}
		const existing = await prisma.tag.findUnique({ where: { slug } });
		if (existing) {
			return NextResponse.json({ error: 'Slug já em uso' }, { status: 400 });
		}
		const tag = await prisma.tag.create({ data: { name, slug } });
		return NextResponse.json({ tag });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
