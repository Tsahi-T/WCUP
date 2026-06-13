import type { Metadata, Viewport } from "next";
import { Heebo, Rubik } from "next/font/google";
import "./globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-body" });
const rubik = Rubik({ subsets: ["hebrew", "latin"], weight: ["500", "700", "800", "900"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "מונדיאל 2026 ⚽ משחק המשפחה",
  description: "ניחושים, דגלים, גאוגרפיה והידעת — משחק העשרה בהשראת המונדיאל",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b1437",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubik.variable}`}>
      <body>
        <div className="stadium-bg" />
        <div className="stadium-glow" />
        {children}
      </body>
    </html>
  );
}
