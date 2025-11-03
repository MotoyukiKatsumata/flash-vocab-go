'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { currentQuizSetAtom, wrongAnswersAtom, currentQuestionIndexAtom, WordPair } from '../store/atoms';
import Link from 'next/link';

// Fisher-Yates shuffle
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function ResultsPage() {
  const router = useRouter();
  const [currentQuizSet, setCurrentQuizSet] = useAtom(currentQuizSetAtom);
  const [wrongAnswers, setWrongAnswers] = useAtom(wrongAnswersAtom);
  const setQuestionIndex = useSetAtom(currentQuestionIndexAtom);

  const total = currentQuizSet.length;
  const incorrectCount = wrongAnswers.length;
  const correctCount = total - incorrectCount;
  const accuracy = total > 0 ? ((correctCount / total) * 100).toFixed(0) : 0;

  // 間違えた問題のみで再挑戦する
  const handleRedo = () => {
    if (incorrectCount === 0) return;

    // 誤答リストを新しいクイズセットにする
    setCurrentQuizSet(shuffleArray([...wrongAnswers]));
    setWrongAnswers([]); // 誤答履歴をリセット
    setQuestionIndex(0); // インデックスをリセット
    
    router.push('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {incorrectCount === 0 ? (
        // 全問正解
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-400 mb-6">全問正解！</h1>
          <p className="text-2xl text-gray-200 mb-12">おめでとうございます！</p>
        </div>
      ) : (
        // 間違いあり
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-100 mb-8">結果</h1>
          <div className="flex gap-8 justify-center mb-8">
            <div className="bg-gray-800 p-6 rounded-lg w-40">
              <div className="text-lg text-gray-400">総問題数</div>
              <div className="text-4xl font-bold text-white">{total}</div>
            </div>
            <div className="bg-green-800 p-6 rounded-lg w-40">
              <div className="text-lg text-green-300">正解</div>
              <div className="text-4xl font-bold text-white">{correctCount}</div>
            </div>
            <div className="bg-red-800 p-6 rounded-lg w-40">
              <div className="text-lg text-red-300">不正解</div>
              <div className="text-4xl font-bold text-white">{incorrectCount}</div>
            </div>
          </div>
          <p className="text-5xl font-bold mb-10">{accuracy}%</p>

          <button
            onClick={handleRedo}
            className="w-full max-w-sm px-8 py-4 bg-orange-600 text-white rounded-lg font-bold text-xl hover:bg-orange-700 transition-colors"
          >
            間違えた {incorrectCount} 問を再挑戦
          </button>
        </div>
      )}

      <div className="mt-16 flex gap-6">
        <Link href="/mode" className="text-blue-400 hover:text-blue-300 text-lg">
          ← モード選択に戻る
        </Link>
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-lg">
          ?? CSV選択に戻る
        </Link>
      </div>
    </div>
  );
}
