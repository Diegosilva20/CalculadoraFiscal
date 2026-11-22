import { NextRequest, NextResponse } from "next/server";
import { renderPageMarkdown } from "@/lib/markdown-pages";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await context.params;
  const headerPath = request.headers.get("x-calculafiscal-md-path");
  const queryPath = request.nextUrl.searchParams.get("path");
  const pathFromSlug =
    slug && slug.length > 0 ? `/${slug.join("/")}` : "/";

  const resolvedPath = headerPath || queryPath || pathFromSlug;
  const resolved = renderPageMarkdown(resolvedPath);

  return new NextResponse(resolved.body, {
    status: resolved.status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "private, no-store",
    },
  });
}
