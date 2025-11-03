'use client';

import { useAtomValue } from 'jotai';
import { csvFileAtom, quizModeAtom } from '../store/atoms';
import Link from 'next/link';

export default function QuizHeader() {
  const csvFile = useAtomValue(csvFileAtom);
  const quizMode = useAtomValue(quizModeAtom);

  const modeText = quizMode === 'en-jp' ? '英単語問題' : '日本語問題';

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-900 sticky top-0 z-10">
      <div className="flex justify-between gap-2 mb-2">
        {/* CSVファイル選択ボタン */}
        <Link 
          href="/"
          className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold rounded-lg text-center shadow-md hover:bg-orange-700 transition-colors"
        >
          CSVファイル選択
        </Link>

        {/* 出題モード選択ボタン */}
        <Link 
          href="/mode"
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg text-center shadow-md hover:bg-blue-700 transition-colors"
        >
          出題モード選択
        </Link>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400 truncate pr-2">
          {csvFile || 'ファイル未選択'}
        </span>
        <span className="text-gray-400 font-semibold shrink-0">
          {quizMode ? modeText : 'モード未選択'}
        </span>
      </div>
    </div>
  );
}
