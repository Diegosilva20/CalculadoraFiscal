import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/seo-schema";

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Google-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  };
}
