import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nemportfolio.in"),
  title: "nem | freelance short video editor — clean edits, on-beat cuts",
  description:
    "Freelance short-form video editor specializing in clean transitions, on-beat cuts, engaging subtitles, sound design, and high quality upscaled edits for maximum audience retention.",
  keywords: [
    "video editor",
    "freelance video editor",
    "short form video editor",
    "YouTube shorts editor",
    "reels editor",
    "TikTok editor",
    "video editing services",
    "nem editor",
    "hire video editor",
  ],
  authors: [{ name: "nem", url: "https://nemportfolio.in" }],
  creator: "nem",
  openGraph: {
    title: "nem | freelance short video editor",
    description:
      "Freelance short-form video editor specializing in clean transitions, on-beat cuts, engaging subtitles, and high quality upscaled edits.",
    url: "https://nemportfolio.in",
    siteName: "nem portfolio",
    images: [{ url: "/image01.jpg", width: 1200, height: 630, alt: "nem — freelance short video editor" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "nem | freelance short video editor",
    description:
      "Freelance short-form video editor — clean transitions, on-beat cuts, engaging subtitles, and high quality upscaled edits.",
    images: [{ url: "/image01.jpg", alt: "nem — freelance short video editor" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nemportfolio.in",
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
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "nem portfolio",
                  url: "https://nemportfolio.in",
                },
                {
                  "@type": "Person",
                  name: "nem",
                  url: "https://nemportfolio.in",
                  jobTitle: "Freelance Short Video Editor",
                  description:
                    "Self-taught video editor specializing in clean transitions, on-beat cuts, engaging subtitles, and high quality upscaled edits.",
                  sameAs: [
                    "https://www.youtube.com/@nowherenem",
                    "https://www.instagram.com/nowherenem",
                  ],
                },
              ],
            }),
          }}
        />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
