import { atom } from "jotai";

// 単語ペアの型定義
export type WordPair = {
  en: string;
  jp: string;
};

// 選択中のCSVファイル名
export const csvFileAtom = atom<string | null>(null);

// CSVから読み込んだ全ての単語ペア
export const allWordPairsAtom = atom<WordPair[]>([]);

// 出題モード ('en-jp' | 'jp-en')
export const quizModeAtom = atom<"en-jp" | "jp-en" | null>(null);

// 現在のラウンドで出題する単語ペアのリスト
export const currentQuizSetAtom = atom<WordPair[]>([]);

// 現在のラウンドでの誤答リスト
export const wrongAnswersAtom = atom<WordPair[]>([]);

// 現在のクイズバッチの開始インデックス (例: 0, 10, 20...)
export const currentQuestionIndexAtom = atom<number>(0);
