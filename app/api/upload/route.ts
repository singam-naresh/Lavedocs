import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentId = formData.get('documentId') as string | null;

    if (!file || !documentId) {
      return NextResponse.json({ error: 'file and documentId are required' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'txt') {
      return NextResponse.json({ error: 'Only .txt files are supported' }, { status: 400 });
    }

    // Save file to /public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const relativePath = `/uploads/${filename}`;

    const record = await prisma.file.create({
      data: { name: file.name, path: relativePath, documentId },
    });

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
