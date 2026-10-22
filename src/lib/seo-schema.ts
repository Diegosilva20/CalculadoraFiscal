// ============================================================================
// GERADOR CENTRAL DE SCHEMA.ORG JSON-LD (PADRÃO CLAUDE-SEO 2026)
// Combina SoftwareApplication (Rich Result Ativo) + BreadcrumbList + FAQPage (GEO)
// ============================================================================

export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://calculafiscal.vercel.app");

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PageSchemaOptions {
  title: string;
  description: string;
  path: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FAQItem[];
}

export function buildCalculatorSchemaGraph(options: PageSchemaOptions) {
  const fullUrl = `${SITE_BASE_URL}${options.path}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "SoftwareApplication",
      "@id": `${fullUrl}#app`,
      name: options.title,
      url: fullUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      isAccessibleForFree: true,
      description: options.description,
      offers: {
        "@type": "Offer",
        price: "0.00",
        priceCurrency: "BRL",
      },
      publisher: {
        "@type": "Organization",
        name: "CalculaFiscal",
        url: SITE_BASE_URL,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${fullUrl}#breadcrumb`,
      itemListElement: options.breadcrumbs.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        item: `${SITE_BASE_URL}${item.path}`,
      })),
    },
  ];

  if (options.faqs && options.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${fullUrl}#faq`,
      mainEntity: options.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
