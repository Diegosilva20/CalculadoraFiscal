import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndicadoresOficiaisBar from "@/components/IndicadoresOficiaisBar";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://calculafiscal.com.br"),
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
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="pt-BR">
      <head>
        {adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col antialiased">
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
