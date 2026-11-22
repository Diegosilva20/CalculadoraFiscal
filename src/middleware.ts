import { NextRequest, NextResponse } from "next/server";

function prefersMarkdown(acceptHeader: string): boolean {
  if (!acceptHeader) return false;
  const lower = acceptHeader.toLowerCase();
  if (!lower.includes("text/markdown")) return false;
  const mdIdx = lower.indexOf("text/markdown");
  const htmlIdx = lower.indexOf("text/html");
  // Só negocia Markdown quando text/markdown é solicitado sem text/html ou com prioridade maior
  return htmlIdx === -1 || mdIdx < htmlIdx;
}

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  if (prefersMarkdown(accept)) {
    const pathname = request.nextUrl.pathname || "/";
    const target = request.nextUrl.clone();
    target.pathname =
      pathname === "/" ? "/api/markdown" : `/api/markdown${pathname}`;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-calculafiscal-md-path", pathname);

    return NextResponse.rewrite(target, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/|icon|opengraph-image|robots\\.txt|sitemap\\.xml|llms\\.txt|ads\\.txt|manifest\\.webmanifest|favicon\\.ico).*)",
  ],
};
