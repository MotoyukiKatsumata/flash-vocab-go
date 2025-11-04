"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import {
  csvFileAtom,
  allWordPairsAtom,
  currentQuestionIndexAtom,
  wrongAnswersAtom,
} from "./store/atoms";

export default function FileSelect() {
  const [csvFiles, setCsvFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCsvFile = useSetAtom(csvFileAtom);
  const setAllWordPairs = useSetAtom(allWordPairsAtom);
  const setQuestionIndex = useSetAtom(currentQuestionIndexAtom);
  const setWrongAnswers = useSetAtom(wrongAnswersAtom);

  const router = useRouter();

  // 1. CSVファイル一覧を取得
  useEffect(() => {
    async function fetchCsvList() {
      try {
        const res = await fetch("/api/csv-list");
        if (!res.ok) throw new Error("Failed to fetch list");
        const data = await res.json();
        setCsvFiles(data.files);
      } catch (err) {
        setError("CSVファイル一覧の取得に失敗しました。");
      }
    }
    fetchCsvList();
  }, []);

  // 2. CSVファイルを選択し、内容をロード・検証
  const handleFileSelect = async (filename: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/csv-load?file=${encodeURIComponent(filename)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ファイルの読み込みに失敗しました。");
      }

      // 状態をリセットして保存
      setAllWordPairs(data.wordPairs);
      setCsvFile(filename);
      setQuestionIndex(0);
      setWrongAnswers([]);

      // モード選択画面へ遷移
      router.push("/mode");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">
        単語クイズ - CSVファイル選択
      </h1>

      {error && (
        <div className="bg-red-800 text-white p-4 rounded-lg mb-6 max-w-sm w-full">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
        </div>
      )}

      {csvFiles.length > 0 ? (
        // 修正点: ファイル選択ボタンを縦に並べる
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {csvFiles.map((file) => (
            <button
              key={file}
              onClick={() => handleFileSelect(file)}
              disabled={loading}
              className="p-4 bg-blue-600 text-white rounded-lg shadow-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-wait"
            >
              {loading ? "読み込み中..." : file}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          `csv-data` ディレクトリにCSVファイルが見つかりません。
        </p>
      )}
    </div>
  );
}
