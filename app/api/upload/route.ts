import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

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

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let relativePath: string;

    if (isProd) {
      // On Vercel: write to /tmp (writable), serve via /api/files/[filename]
      const tmpDir = '/tmp/uploads';
      await mkdir(tmpDir, { recursive: true });
      await writeFile(path.join(tmpDir, filename), buffer);
      relativePath = `/api/files/${filename}`;
    } else {
      // Local: write to public/uploads/, served as static file
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      relativePath = `/uploads/${filename}`;
    }

    const record = await prisma.file.create({
      data: { name: file.name, path: relativePath, documentId },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
