"use client";

import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  csvFileAtom,
  quizModeAtom,
  currentQuizSetAtom,
  allWordPairsAtom,
  currentQuestionIndexAtom,
  wrongAnswersAtom,
} from "../store/atoms";
import Link from "next/link";

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
  const [, setQuizMode] = useAtom(quizModeAtom); // quizModeは使用しない
  const setCurrentQuizSet = useSetAtom(currentQuizSetAtom);
  const setQuestionIndex = useSetAtom(currentQuestionIndexAtom);
  const setWrongAnswers = useSetAtom(wrongAnswersAtom);

  const router = useRouter();

  // CSVファイルが選択されていない場合はリダイレクト
  useEffect(() => {
    if (!csvFile || allWordPairs.length === 0) {
      router.replace("/");
    }
  }, [csvFile, allWordPairs, router]);

  // 修正点: ボタンクリックでモードを設定し、即座に遷移
  const handleModeSelect = (mode: "en-jp" | "jp-en") => {
    setQuizMode(mode);

    // 最初のクイズセットを準備（全単語をシャッフル）
    setCurrentQuizSet(shuffleArray([...allWordPairs]));
    setQuestionIndex(0); // 最初の10問から
    setWrongAnswers([]); // 誤答履歴をリセット

    router.push("/quiz");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">出題モード選択</h1>
      <p className="text-lg text-gray-400 mb-8">
        ファイル: <span className="font-semibold text-white">{csvFile}</span>
      </p>

      <div className="flex flex-col gap-4 mb-8 w-full max-w-xs">
        <button
          onClick={() => handleModeSelect("en-jp")}
          className={`p-6 rounded-lg font-semibold text-xl w-full transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg`}
        >
          英単語問題
          <span className="block text-sm font-normal opacity-90">
            (英語 → 日本語)
          </span>
        </button>

        <button
          onClick={() => handleModeSelect("jp-en")}
          className={`p-6 rounded-lg font-semibold text-xl w-full transition-all bg-teal-600 text-white hover:bg-teal-700 shadow-lg`}
        >
          日本語問題
          <span className="block text-sm font-normal opacity-90">
            (日本語 → 英語)
          </span>
        </button>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          ← CSVファイル選択に戻る
        </Link>
      </div>
    </div>
  );
}
