import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "수프리마 랩",
  description: "학생부 분석과 입시 진단을 위한 단독 운영 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
