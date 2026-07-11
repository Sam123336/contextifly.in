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
  title: "Contextifly — Give your AI a memory of your codebase",
  description:
    "A persistent context engine for AI coding assistants. Contextifly compiles your React, NestJS and Flutter code into a live, deterministic knowledge graph — 100% local, evidence-backed, and full-stack. See how it beats other graph tools, live.",
  keywords: [
    "Contextifly",
    "code knowledge graph",
    "AI coding assistant",
    "MCP",
    "context engine",
    "software knowledge graph",
    "Claude Code",
  ],
  openGraph: {
    title: "Contextifly — Give your AI a memory of your codebase",
    description:
      "A compiler for software architecture. A live, deterministic code graph — 100% local, full-stack, evidence-backed.",
    type: "website",
  },
  metadataBase: new URL("https://contextifly.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
