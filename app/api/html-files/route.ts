import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dirPath = path.join(process.cwd(), 'public', 'html');
  const files = fs.readdirSync(dirPath);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  return NextResponse.json(htmlFiles);
}
