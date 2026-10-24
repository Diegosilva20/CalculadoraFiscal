// ============================================================================
// GERADOR CENTRAL DE SCHEMA.ORG JSON-LD (PADRÃO CLAUDE-SEO 2026)
// Combina SoftwareApplication (Rich Result Ativo) + BreadcrumbList + FAQPage (GEO)
// ============================================================================

export function normalizeSiteUrl(rawUrl?: string): string {
  const candidate = (
    rawUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "https://calculadora-fiscal-one.vercel.app"
  ).trim();

  const withProtocol =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;

  // Remove barras finais duplicadas para nunca gerar "https://dominio.com//rota"
  return withProtocol.replace(/\/+$/, "");
}

export const SITE_BASE_URL = normalizeSiteUrl();

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
  const cleanPath = options.path.startsWith("/") ? options.path : `/${options.path}`;
  const fullUrl = `${SITE_BASE_URL}${cleanPath}`;

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
      itemListElement: options.breadcrumbs.map((item, idx) => {
        const itemPath = item.path === "/" ? "" : item.path.startsWith("/") ? item.path : `/${item.path}`;
        return {
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          item: `${SITE_BASE_URL}${itemPath}`,
        };
      }),
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
