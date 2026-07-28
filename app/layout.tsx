import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crowdy | 사람 많은 곳에서도, 우리는 다시 만난다.",
  description: "축제장에서 일행의 위치를 찾고, 안전하게 다시 만나는 Crowdy 프로토타입입니다.",
  openGraph: { title: "Crowdy", description: "사람 많은 곳에서도, 우리는 다시 만난다.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Crowdy", description: "사람 많은 곳에서도, 우리는 다시 만난다.", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
