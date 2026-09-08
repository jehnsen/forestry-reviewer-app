import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForestGuro - Forester Licensure Exam Reviewer",
  description:
    "Pass the PRC Forester Licensure Examination with ForestGuro. AI-powered board exam reviewer covering silviculture, mensuration, forest management, and Philippine forestry law.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
