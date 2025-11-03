'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { csvFileAtom, quizModeAtom, currentQuizSetAtom, allWordPairsAtom, currentQuestionIndexAtom, wrongAnswersAtom } from '../store/atoms';
import Link from 'next/link';

// Fisher-Yates shuffle
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function ModeSelect() {
  const [csvFile] = useAtom(csvFileAtom);
  const [allWordPairs] = useAtom(allWordPairsAtom);
  const [quizMode, setQuizMode] = useAtom(quizModeAtom);
  const setCurrentQuizSet = useSetAtom(currentQuizSetAtom);
  const setQuestionIndex = useSetAtom(currentQuestionIndexAtom);
  const setWrongAnswers = useSetAtom(wrongAnswersAtom);

  const router = useRouter();

  // CSVファイルが選択されていない場合はリダイレクト
  useEffect(() => {
    if (!csvFile || allWordPairs.length === 0) {
      router.replace('/');
    }
  }, [csvFile, allWordPairs, router]);

  const handleConfirm = () => {
    if (!quizMode) return;

    // 最初のクイズセットを準備（全単語をシャッフル）
    setCurrentQuizSet(shuffleArray([...allWordPairs]));
    setQuestionIndex(0); // 最初の10問から
    setWrongAnswers([]); // 誤答履歴をリセット
    
    router.push('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">出題モード選択</h1>
      <p className="text-lg text-gray-400 mb-8">ファイル: <span className="font-semibold text-white">{csvFile}</span></p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setQuizMode('en-jp')}
          className={`p-6 rounded-lg font-semibold text-lg w-48 transition-all
            ${quizMode === 'en-jp' 
              ? 'bg-indigo-600 text-white ring-4 ring-indigo-400' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          英単語問題
          <span className="block text-sm">(英語 → 日本語)</span>
        </button>

        <button
          onClick={() => setQuizMode('jp-en')}
          className={`p-6 rounded-lg font-semibold text-lg w-48 transition-all
            ${quizMode === 'jp-en' 
              ? 'bg-teal-600 text-white ring-4 ring-teal-400' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          日本語問題
          <span className="block text-sm">(日本語 → 英語)</span>
        </button>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!quizMode}
        className="px-10 py-4 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        確定
      </button>

      <div className="mt-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          ← CSVファイル選択に戻る
        </Link>
      </div>
    </div>
  );
}
