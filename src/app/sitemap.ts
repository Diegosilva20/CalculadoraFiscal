import type { MetadataRoute } from "next";
import { CNAES_DATA } from "@/data/cnaes";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://calculafiscal.vercel.app");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/clt-vs-pj`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/cnae`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/calculadora-salario-liquido`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calculadora-rescisao`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/termos-de-uso`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const salarioRoutes: MetadataRoute.Sitemap = FAIXAS_SALARIAIS_SEO.map((valor) => ({
    url: `${baseUrl}/clt-vs-pj/salario/${valor}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const profissaoRoutes: MetadataRoute.Sitemap = PROFISSOES_SEO.map((prof) => ({
    url: `${baseUrl}/clt-vs-pj/profissao/${prof.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const cnaeRoutes: MetadataRoute.Sitemap = CNAES_DATA.map((cnae) => ({
    url: `${baseUrl}/cnae/${cnae.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...salarioRoutes, ...profissaoRoutes, ...cnaeRoutes];
}
