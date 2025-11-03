import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Jotaiプロバイダ

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "英単語クイズアプリ",
  description: "CSVから英単語クイズを生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark"> {/* ダークモードをデフォルトに */}
      <body className={inter.className}>
        <Providers> {/* JotaiのProviderでラップ */}
          <div className="min-h-screen bg-gray-900 text-gray-100">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
