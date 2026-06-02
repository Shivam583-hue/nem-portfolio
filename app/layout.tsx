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
  title: "nem | freelance short video editor",
  description:
    "Self-taught video editor specializing in clean transitions, on-beat cuts, engaging subtitles, and high quality upscaled edits.",
  openGraph: {
    title: "nem | freelance short video editor",
    description:
      "Self-taught video editor specializing in clean transitions, on-beat cuts, engaging subtitles, and high quality upscaled edits.",
    images: [{ url: "/image01.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nem | freelance short video editor",
    description:
      "Self-taught video editor specializing in clean transitions, on-beat cuts, engaging subtitles, and high quality upscaled edits.",
    images: ["/image01.jpg"],
  },
  other: {
    "theme-color": "#0a0a0a",
  },
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
