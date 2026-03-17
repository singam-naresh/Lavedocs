import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CURRENT_USER } from '@/lib/types';

const include = { collaborators: true, files: true };

export async function GET() {
  try {
    const docs = await prisma.document.findMany({
      include,
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, owner } = await req.json();
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const doc = await prisma.document.create({
      data: { title: title.trim(), content: '', owner: owner ?? CURRENT_USER },
      include,
    });
    return NextResponse.json(doc, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
