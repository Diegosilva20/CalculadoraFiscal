"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
}

export const HEADER_NAV_ITEMS: NavItem[] = [
  { label: "CLT vs PJ", href: "/clt-vs-pj" },
  { label: "Tabela CNAE", href: "/cnae" },
  { label: "Fator R", href: "/calculadora-fator-r" },
  { label: "Salário Líquido", href: "/calculadora-salario-liquido" },
  { label: "Custo Funcionário", href: "/custo-funcionario-clt" },
  { label: "Rescisão e Férias", href: "/calculadora-rescisao" },
];

export default function HeaderNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname() || "/";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  if (mobile) {
    return (
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-medium text-slate-700 whitespace-nowrap">
        {HEADER_NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`px-3 py-2 rounded-md border transition-colors ${
                active
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav
      aria-label="Navegação principal"
      className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700"
    >
      {HEADER_NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
              active
                ? "bg-slate-100 text-slate-950 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
