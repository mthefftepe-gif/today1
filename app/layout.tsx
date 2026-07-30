import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEACH:ON | 광안리 스마트 해변",
  description: "AI 기반 광안리 해수욕장 실시간 혼잡도 관리 서비스",
  openGraph: { title: "BEACH:ON | 광안리 스마트 해변", description: "AI 기반 광안리 해수욕장 실시간 혼잡도 관리 서비스", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
