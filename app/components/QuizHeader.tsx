"use client";

import { useAtomValue } from "jotai";
import { csvFileAtom, quizModeAtom } from "../store/atoms";
import Link from "next/link";

export default function QuizHeader() {
  const csvFile = useAtomValue(csvFileAtom);
  const quizMode = useAtomValue(quizModeAtom);

  const modeText = quizMode === "en-jp" ? "英語 → 日本語" : "日本語 → 英語";

  return (
    <div className="w-full bg-gray-900 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
      <div className="flex justify-between w-full max-w-3xl mx-auto p-3">
        {/* 左側: CSVファイル選択とファイル名 */}
        <div className="flex flex-col items-start w-1/2 pr-2">
          <Link
            href="/"
            className="px-3 py-1 bg-orange-600 text-white font-medium rounded-md text-sm hover:bg-orange-700 transition-colors shrink-0"
          >
            CSVファイル選択
          </Link>
          <span className="text-xs text-gray-400 mt-1 truncate w-full">
            {csvFile || "ファイル未選択"}
          </span>
        </div>

        {/* 右側: 出題モード選択とモード名 */}
        <div className="flex flex-col items-end w-1/2 pl-2">
          <Link
            href="/mode"
            className="px-3 py-1 bg-blue-600 text-white font-medium rounded-md text-sm hover:bg-blue-700 transition-colors shrink-0"
          >
            出題モード選択
          </Link>
          <span className="text-xs text-gray-400 mt-1 font-semibold truncate w-full text-right">
            {quizMode ? modeText : "モード未選択"}
          </span>
        </div>
      </div>
    </div>
  );
}
