import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync'; // 同期パーサーを使用
import { WordPair } from '@/app/store/atoms';

const csvDir = path.join(process.cwd(), 'csv-data');

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filename = searchParams.get('file');

  // --- セキュリティ: パストラバーサル防止 ---
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const filePath = path.join(csvDir, filename);

  try {
    // ファイルの存在確認
    await fs.access(filePath);
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const records = parse(fileContent, {
      skip_empty_lines: true,
    });

    // --- バリデーション ---

    // 1. 行数のバリデーション (5?200行)
    if (records.length < 5 || records.length > 200) {
      return NextResponse.json(
        {
          error: `行数が範囲外です。5?200行にしてください。 (現在: ${records.length}行)`,
        },
        { status: 400 }
      );
    }

    const wordPairs: WordPair[] = [];

    // 2. 列数のバリデーション (全行が2列)
    for (const record of records) {
      if (record.length !== 2) {
        return NextResponse.json(
          {
            error: `CSVの形式が不正です。全ての行は2列（英語,日本語）である必要があります。`,
          },
          { status: 400 }
        );
      }
      wordPairs.push({ en: record[0].trim(), jp: record[1].trim() });
    }

    // 検証成功
    return NextResponse.json({ wordPairs });

  } catch (error: any) {
    console.error('CSV load error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse CSV file.' },
      { status: 500 }
    );
  }
}
