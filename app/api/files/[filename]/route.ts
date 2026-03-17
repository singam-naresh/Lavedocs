import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join('/tmp', 'uploads', filename);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
