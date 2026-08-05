import type { Metadata } from "next";
import "./globals.css";
import "./live-weather.css";
import LiveWeatherRibbon from "./live-weather-ribbon";

export const metadata: Metadata = { title: "오늘바다 부산 | 스마트 해변 추천", description: "날씨와 활동 취향으로 찾는 오늘의 부산 바다", openGraph: { title: "오늘바다 부산", description: "오늘, 당신에게 가장 좋은 바다는 어디인가요?", images: ["/og.png"] }, twitter: { card: "summary_large_image", images: ["/og.png"] } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}<LiveWeatherRibbon /></body></html>; }
