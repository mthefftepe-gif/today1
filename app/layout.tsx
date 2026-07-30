import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wavemap | 광안리 스마트 해변",
  description: "AI 기반 광안리 해수욕장 실시간 혼잡도 관리 서비스",
  openGraph: { title: "wavemap | 광안리 스마트 해변", description: "AI 기반 광안리 해수욕장 실시간 혼잡도 관리 서비스", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><style>{`body,button,input,textarea{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",Arial,sans-serif!important}.eyebrow,.login-kicker,.scene-eyebrow,.facility-intro p,.route-hero p,.route-top span,.facility-top span,.demo-badge{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",Arial,sans-serif!important;letter-spacing:.02em!important;font-weight:700!important}`}</style>{children}</body></html>;
}
