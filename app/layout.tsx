import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

// Editöryel serif başlık fontu (yüksek kontrast, karakterli)
const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// Sakin, sıcak grotesk gövde fontu
const sans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

// İnceleme detayları (adres, URL, kod) için monospace
const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "PhishGuard — Oltalama Farkındalık Simülasyonu",
  description:
    "E-posta, SMS ve sesli arama (vishing) senaryolarıyla siber güvenlik okuryazarlığını test eden oyunlaştırılmış farkındalık platformu.",
  keywords: [
    "oltalama",
    "phishing",
    "vishing",
    "smishing",
    "siber güvenlik",
    "farkındalık",
    "simülasyon",
  ],
  authors: [{ name: "PhishGuard" }],
  openGraph: {
    title: "PhishGuard — Oltalama Farkındalık Simülasyonu",
    description:
      "Sahte e-posta, SMS ve arama senaryolarını ayırt et, puan topla, zayıf yönlerini keşfet.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EEE3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Providers>
          <a href="#main" className="skip-link">
            İçeriğe geç
          </a>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
