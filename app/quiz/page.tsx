'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import {
  WordPair,
  quizModeAtom,
  currentQuizSetAtom,
  currentQuestionIndexAtom,
  wrongAnswersAtom,
} from '../store/atoms';
import QuizHeader from '../components/QuizHeader';
import FeedbackToast from '../components/FeedbackToast';

// 配列をシャッフルするヘルパー関数
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type Feedback = { type: 'correct' | 'incorrect'; message: string } | null;

export default function QuizPage() {
  const router = useRouter();
  const quizMode = useAtomValue(quizModeAtom);
  const [currentQuizSet] = useAtom(currentQuizSetAtom);
  const [questionIndex, setQuestionIndex] = useAtom(currentQuestionIndexAtom);
  const [wrongAnswers, setWrongAnswers] = useAtom(wrongAnswersAtom);

  // --- 画面内でのみ使用するローカルステート ---
  // 現在画面に表示している10問（またはそれ以下）の単語ペア
  const [batchPairs, setBatchPairs] = useState<WordPair[]>([]);
  
  // 左列（問題）と右列（回答）
  const [leftColumn, setLeftColumn] = useState<string[]>([]);
  const [rightColumn, setRightColumn] = useState<string[]>([]);
  
  // ユーザーの選択
  const [selectedLeft, setSelectedLeft] = useState<{ index: number; value: string } | null>(null);
  const [selectedRight, setSelectedRight] = useState<{ index: number; value: string } | null>(null);

  // 正解したペア（ボタンを無効化/スタイル変更するため）
  const [matchedIndices, setMatchedIndices] = useState<{ left: number; right: number }[]>([]);

  // 正誤フィードバック
  const [feedback, setFeedback] = useState<Feedback>(null);

  // --- クイズの初期化・バッチ処理 ---
  useEffect(() => {
    // クイズセットが空（モード選択から戻った等）ならリダイレクト
    if (currentQuizSet.length === 0) {
      router.replace('/mode');
      return;
    }

    // 現在のインデックスから10問を切り出す
    const currentBatch = currentQuizSet.slice(questionIndex, questionIndex + 10);
    setBatchPairs(currentBatch);

    // 問題列と回答列を生成
    const questions = currentBatch.map(p => (quizMode === 'en-jp' ? p.en : p.jp));
    const answers = currentBatch.map(p => (quizMode === 'en-jp' ? p.jp : p.en));

    // それぞれをシャッフルしてセット
    setLeftColumn(shuffleArray(questions));
    setRightColumn(shuffleArray(answers));

    // 内部ステートをリセット
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIndices([]);
    setFeedback(null);

  }, [currentQuizSet, questionIndex, quizMode, router]);

  // --- 正誤判定ロジック ---
  useEffect(() => {
    // 両方が選択された時のみ判定
    if (!selectedLeft || !selectedRight) return;

    // 1. 選択されたペアが正しいかチェック
    const question = selectedLeft.value;
    const answer = selectedRight.value;

    // batchPairs (元のペアリスト) を使って正解を検索
    const correctPair = batchPairs.find(p => 
      (quizMode === 'en-jp' ? p.en === question : p.jp === question)
    );

    const isCorrect = correctPair 
      ? (quizMode === 'en-jp' ? correctPair.jp === answer : correctPair.en === answer) 
      : false;

    if (isCorrect) {
      // 2. 正解の場合
      setMatchedIndices(prev => [
        ...prev,
        { left: selectedLeft.index, right: selectedRight.index },
      ]);
      setFeedback({ type: 'correct', message: '正解！' });
    } else {
      // 3. 不正解の場合
      const wrongPair = correctPair || batchPairs.find(p => (quizMode === 'en-jp' ? p.jp === answer : p.en === answer));
      
      // 誤答リストに追加 (重複は避ける)
      if (wrongPair && !wrongAnswers.some(wp => wp.en === wrongPair.en)) {
        setWrongAnswers(prev => [...prev, wrongPair]);
      }
      
      // 正しい答えを表示
      const correctAnswer = quizMode === 'en-jp' ? correctPair?.jp : correctPair?.en;
      setFeedback({
        type: 'incorrect',
        message: `不正解: ${question} は ${correctAnswer} です`,
      });
    }

    // 選択をリセット
    setSelectedLeft(null);
    setSelectedRight(null);

  }, [selectedLeft, selectedRight, quizMode, batchPairs, wrongAnswers, setWrongAnswers]);

  // --- 次のバッチ / 結果画面への遷移 ---
  useEffect(() => {
    // このバッチの全問が正解したら
    if (batchPairs.length > 0 && matchedIndices.length === batchPairs.length) {
      
      // 次の10問があるか？
      if (questionIndex + 10 < currentQuizSet.length) {
        // 次のバッチへ
        const nextIndex = questionIndex + 10;
        // 少し待ってから次の問題へ（正解フィードバックを見せるため）
        setTimeout(() => {
          setQuestionIndex(nextIndex);
        }, 1000); // 1秒
      } else {
        // 全問終了 → 結果画面へ
        setTimeout(() => {
          router.push('/results');
        }, 1000); // 1秒
      }
    }
  }, [matchedIndices, batchPairs, questionIndex, currentQuizSet, setQuestionIndex, router]);


  // ボタンの disabled 状態を判定
  const isLeftDisabled = (index: number) => 
    matchedIndices.some(m => m.left === index) || !!feedback;
  
  const isRightDisabled = (index: number) => 
    matchedIndices.some(m => m.right === index) || !!feedback;

  // ボタンのスタイルを決定
  const getLeftStyle = (index: number) => {
    if (matchedIndices.some(m => m.left === index)) return 'bg-green-700 opacity-50';
    if (selectedLeft?.index === index) return 'ring-4 ring-blue-400 bg-blue-700';
    return 'bg-gray-800 hover:bg-gray-700';
  };
  const getRightStyle = (index: number) => {
    if (matchedIndices.some(m => m.right === index)) return 'bg-green-700 opacity-50';
    if (selectedRight?.index === index) return 'ring-4 ring-yellow-400 bg-yellow-700';
    return 'bg-gray-800 hover:bg-gray-700';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <QuizHeader />

      <div className="flex-grow w-full max-w-3xl mx-auto p-4">
        <h2 className="text-xl font-semibold text-center text-gray-200 mb-6">
          同じ意味のペアをタップしてください
        </h2>

        {/* 進捗バー */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${((questionIndex + matchedIndices.length) / currentQuizSet.length) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* 左列（問題） */}
          <div className="flex flex-col gap-3 md:gap-4">
            {leftColumn.map((item, index) => (
              <button
                key={index}
                disabled={isLeftDisabled(index)}
                onClick={() => setSelectedLeft({ index, value: item })}
                className={`w-full p-4 rounded-lg shadow-md font-medium text-center transition-all duration-200
                  ${getLeftStyle(index)}
                  disabled:cursor-not-allowed
                `}
              >
                {item}
              </button>
            ))}
          </div>

          {/* 右列（回答） */}
          <div className="flex flex-col gap-3 md:gap-4">
            {rightColumn.map((item, index) => (
              <button
                key={index}
                disabled={isRightDisabled(index)}
                onClick={() => setSelectedRight({ index, value: item })}
                className={`w-full p-4 rounded-lg shadow-md font-medium text-center transition-all duration-200
                  ${getRightStyle(index)}
                  disabled:cursor-not-allowed
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
}
