import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const include = { collaborators: true, files: true };

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const doc = await prisma.document.findUnique({ where: { id: params.id }, include });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, content } = body;

    const data: { title?: string; content?: string } = {};
    if (typeof title === 'string') data.title = title.trim();
    if (typeof content === 'string') data.content = content;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const doc = await prisma.document.update({ where: { id: params.id }, data, include });
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.document.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
