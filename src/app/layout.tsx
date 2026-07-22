import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AmbientBackdrop from "@/components/AmbientBackdrop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.contextifly.in";
const TITLE = "Contextifly: Give your AI a memory of your codebase";
const DESCRIPTION =
  "A persistent context engine for AI coding assistants. Contextifly compiles your React, NestJS and Flutter code into a live, deterministic knowledge graph. 100% local, evidence-backed, and full-stack. See how it beats other graph tools, live.";
const OG_DESCRIPTION =
  "A compiler for software architecture. A live, deterministic code graph. 100% local, full-stack, evidence-backed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Contextifly",
  },
  description: DESCRIPTION,
  applicationName: "Contextifly",
  authors: [{ name: "Sambit Kumar Ghosh", url: "https://github.com/Sam123336" }],
  creator: "Sambit Kumar Ghosh",
  publisher: "Sambit Kumar Ghosh",
  keywords: [
    "Contextifly",
    "code knowledge graph",
    "AI coding assistant",
    "MCP",
    "context engine",
    "software knowledge graph",
    "Claude Code",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Contextifly",
    title: TITLE,
    description: OG_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: OG_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Structured data — associates the site with its creator for search engines
// without showing the name anywhere in the visible UI.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Contextifly",
      description: OG_DESCRIPTION,
      creator: { "@id": `${SITE_URL}/#person` },
      author: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Sambit Kumar Ghosh",
      description: "Creator and developer of Contextifly",
      url: SITE_URL,
      sameAs: ["https://github.com/Sam123336"],
    },
  ],
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AmbientBackdrop />
        {children}
      </body>
    </html>
  );
}
