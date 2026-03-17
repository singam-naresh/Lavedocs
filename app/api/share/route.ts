import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { documentId, email } = await req.json();

    if (!documentId || !email) {
      return NextResponse.json({ error: 'documentId and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    const existing = await prisma.collaborator.findFirst({
      where: { documentId, email: email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json({ message: 'Already a collaborator' });
    }

    const collaborator = await prisma.collaborator.create({
      data: { documentId, email: email.toLowerCase().trim() },
    });
    return NextResponse.json(collaborator, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to share document' }, { status: 500 });
  }
}
