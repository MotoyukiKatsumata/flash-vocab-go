"use client";

import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  // Providerをクライアントコンポーネントとしてラップ
  return <Provider>{children}</Provider>;
}
