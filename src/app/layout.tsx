import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndicadoresOficiaisBar from "@/components/IndicadoresOficiaisBar";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { normalizeSiteUrl } from "@/lib/seo-schema";

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

const siteUrl = normalizeSiteUrl();
const defaultTitle =
  "CalculaFiscal 2026 — Calculadora CLT vs PJ, Tabela CNAE, Fator R e Salário Líquido";
const defaultDescription =
  "Simuladores trabalhistas e tributários atualizados para 2026: Calculadora CLT vs PJ por salário e profissão, Tabela CNAE com Fator R (6%), Reforma Tributária (CBS/IBS) e Salário Líquido com isenção de IRPF até R$ 5.000.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | CalculaFiscal 2026",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "CalculaFiscal 2026",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-GFLR2VMELW";

  const consentInitScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    try {
      var raw = localStorage.getItem('calculafiscal_lgpd_consent_v1');
      var parsed = raw ? JSON.parse(raw) : null;
      var modo = parsed && parsed.tipo ? parsed.tipo : null;
      gtag('consent', 'default', {
        ad_storage: modo === 'all' ? 'granted' : 'denied',
        ad_user_data: modo === 'all' ? 'granted' : 'denied',
        ad_personalization: modo === 'all' ? 'granted' : 'denied',
        analytics_storage: modo === 'essential' ? 'denied' : 'granted',
        wait_for_update: 500
      });
    } catch (e) {
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
        wait_for_update: 500
      });
    }
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `;

  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
        {gaId && (
          <>
            <Script id="gtag-consent-init" strategy="beforeInteractive">
              {consentInitScript}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
          </>
        )}
        {adsenseClientId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
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
