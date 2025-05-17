import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getErrorMessage } from '@/lib/utils';

interface Params {
	params: { tagId: string };
}

export async function PUT(request: Request, { params }: Params) {
	try {
		const { tagId } = params;
		const { name, slug } = await request.json();
		if (!name || !slug) {
			return NextResponse.json({ error: 'Nome e slug são obrigatórios' }, { status: 400 });
		}
		const tag = await prisma.tag.update({
			where: { id: tagId },
			data: { name, slug },
		});
		return NextResponse.json({ tag });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		const { tagId } = params;
		await prisma.tag.delete({ where: { id: tagId } });
		return NextResponse.json({ message: 'Tag removida com sucesso' });
	} catch (error) {
		return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
	}
}
