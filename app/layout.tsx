import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Crypto Trending Radar",
  description: "Personal Web3 analytics dashboard for tracking trending coins, sectors, and narratives.",
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    title: "Crypto Trending Radar",
    description: "Track crypto momentum, sectors and narratives in one clean dashboard.",
    type: "website",
    url: "https://crypto-trending-radar.example",
    siteName: "Crypto Trending Radar"
  },
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${space.variable} font-sans min-h-screen bg-slate-950 text-slate-50`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
