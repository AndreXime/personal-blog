import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getErrorMessage } from '@/lib/utils';

interface Params {
	params: { categoryId: string };
}

export async function PUT(request: Request, { params }: Params) {
	try {
		const { categoryId } = params;
		const { name, slug, description } = await request.json();
		if (!name || !slug) {
			return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 });
		}
		const category = await prisma.category.update({
			where: { id: categoryId },
			data: { name, slug, description },
		});
		return NextResponse.json({ category });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		const { categoryId } = params;
		await prisma.category.delete({ where: { id: categoryId } });
		return NextResponse.json({ message: 'Categoria removida com sucesso' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
