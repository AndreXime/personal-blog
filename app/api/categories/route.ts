import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getErrorMessage } from '@/lib/utils';

export async function GET() {
	try {
		const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
		return NextResponse.json({ categories });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const { name, slug, description } = await request.json();
		if (!name || !slug) {
			return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 });
		}
		const existing = await prisma.category.findUnique({ where: { slug } });
		if (existing) {
			return NextResponse.json({ error: 'Slug já em uso' }, { status: 400 });
		}
		const category = await prisma.category.create({
			data: { name, slug, description },
		});
		return NextResponse.json({ category });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
