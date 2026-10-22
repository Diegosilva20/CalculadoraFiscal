import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndicadoresOficiaisBar from "@/components/IndicadoresOficiaisBar";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://calculafiscal.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "CalculaFiscal 2026 — Calculadora CLT vs PJ, Tabela CNAE, Fator R e Salário Líquido",
    template: "%s | CalculaFiscal 2026",
  },
  description:
    "Simuladores trabalhistas e tributários atualizados para 2026: Calculadora CLT vs PJ por salário e profissão, Tabela CNAE com Fator R (6%), Reforma Tributária (CBS/IBS) e Salário Líquido com isenção de IRPF até R$ 5.000.",
  keywords: [
    "calculadora clt vs pj 2026",
    "tabela cnae simples nacional 2026",
    "calculadora fator r 2026",
    "salario liquido 2026 isencao 5000",
    "reforma tributaria cbs ibs calculadora pj",
    "calculadora rescisao clt 2026",
    "custo funcionario clt 2026",
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <head>
        {adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
        <IndicadoresOficiaisBar />
        <Header />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
