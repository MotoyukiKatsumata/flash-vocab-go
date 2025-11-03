import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// CSVファイルが格納されているディレクトリ
const csvDir = path.join(process.cwd(), 'csv-data');

export async function GET() {
  try {
    const files = await fs.readdir(csvDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    return NextResponse.json({ files: csvFiles });
  } catch (error) {
    console.error('CSV directory read error:', error);
    return NextResponse.json(
      { error: 'Failed to read CSV directory.' },
      { status: 500 }
    );
  }
}
