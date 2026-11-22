import React from "react";
import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo-schema";

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="no-print text-xs text-slate-500 flex flex-wrap items-center gap-2"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={item.path}>
            {idx > 0 && <span aria-hidden="true">/</span>}
            {isLast ? (
              <span aria-current="page" className="font-medium text-slate-800">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="hover:text-blue-700 transition-colors">
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
