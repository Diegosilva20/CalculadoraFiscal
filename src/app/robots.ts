import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { normalizeSiteUrl } from "@/lib/seo-schema";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") || "https";

  const baseUrl = host
    ? normalizeSiteUrl(`${proto}://${host}`)
    : normalizeSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
