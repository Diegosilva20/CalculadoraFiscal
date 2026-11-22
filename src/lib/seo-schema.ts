import type { Metadata } from "next";

// ============================================================================
// GERADOR CENTRAL DE SCHEMA.ORG JSON-LD E METADADOS SOCIAIS (PADRÃO CLAUDE-SEO 2026)
// Combina SoftwareApplication (Rich Result Ativo) + BreadcrumbList + FAQPage (GEO)
// ============================================================================

const LEGACY_WRONG_HOSTS = new Set([
  "calculadora-fiscal.vercel.app",
  "calculafiscal.vercel.app",
]);

function isValidConfiguredSiteUrl(url?: string): boolean {
  if (!url || !url.trim()) return false;
  try {
    const withProto = /^https?:\/\//i.test(url.trim())
      ? url.trim()
      : `https://${url.trim()}`;
    const parsed = new URL(withProto);
    return !LEGACY_WRONG_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function normalizeSiteUrl(rawUrl?: string): string {
  const envSiteUrl = isValidConfiguredSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
    ? process.env.NEXT_PUBLIC_SITE_URL
    : undefined;

  const candidate = (
    rawUrl ||
    envSiteUrl ||
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
  const cleanPath =
    options.path === "/"
      ? ""
      : options.path.startsWith("/")
      ? options.path
      : `/${options.path}`;
  const fullUrl = `${SITE_BASE_URL}${cleanPath}`;
  const orgId = `${SITE_BASE_URL}/#organization`;
  const websiteId = `${SITE_BASE_URL}/#website`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: "CalculaFiscal",
      url: SITE_BASE_URL,
      email: "contato@calculafiscal.com.br",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contato@calculafiscal.com.br",
        url: `${SITE_BASE_URL}/contato`,
        availableLanguage: ["Portuguese"],
        areaServed: "BR",
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "CalculaFiscal 2026",
      url: SITE_BASE_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": orgId },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_BASE_URL}/cnae?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
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
      isPartOf: { "@id": websiteId },
      offers: {
        "@type": "Offer",
        price: "0.00",
        priceCurrency: "BRL",
      },
      publisher: { "@id": orgId },
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

export function buildSocialMetadata(params: {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
}): Metadata {
  const cleanPath =
    params.path === "/"
      ? ""
      : params.path.startsWith("/")
      ? params.path
      : `/${params.path}`;
  const fullUrl = `${SITE_BASE_URL}${cleanPath}`;

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: cleanPath || "/",
    },
    ...(params.robots ? { robots: params.robots } : {}),
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "CalculaFiscal 2026",
      url: fullUrl,
      title: params.title,
      description: params.description,
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
    },
  };
}

export function buildInstitutionalPageSchema(options: PageSchemaOptions) {
  const cleanPath =
    options.path === "/"
      ? ""
      : options.path.startsWith("/")
      ? options.path
      : `/${options.path}`;
  const fullUrl = `${SITE_BASE_URL}${cleanPath}`;
  const orgId = `${SITE_BASE_URL}/#organization`;
  const websiteId = `${SITE_BASE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "CalculaFiscal",
        url: SITE_BASE_URL,
        email: "contato@calculafiscal.com.br",
        address: { "@type": "PostalAddress", addressCountry: "BR" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contato@calculafiscal.com.br",
          url: `${SITE_BASE_URL}/contato`,
          availableLanguage: ["Portuguese"],
          areaServed: "BR",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "CalculaFiscal 2026",
        url: SITE_BASE_URL,
        inLanguage: "pt-BR",
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": `${fullUrl}#webpage`,
        url: fullUrl,
        name: options.title,
        description: options.description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": websiteId },
        publisher: { "@id": orgId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${fullUrl}#breadcrumb`,
        itemListElement: options.breadcrumbs.map((item, idx) => {
          const itemPath =
            item.path === "/"
              ? ""
              : item.path.startsWith("/")
              ? item.path
              : `/${item.path}`;
          return {
            "@type": "ListItem",
            position: idx + 1,
            name: item.name,
            item: `${SITE_BASE_URL}${itemPath}`,
          };
        }),
      },
    ],
  };
}
