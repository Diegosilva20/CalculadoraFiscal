import React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";

const NAV_ITEMS = [
  { label: "CLT vs PJ", href: "/clt-vs-pj" },
  { label: "Tabela CNAE", href: "/cnae" },
  { label: "Fator R", href: "/calculadora-fator-r" },
  { label: "Salário Líquido", href: "/calculadora-salario-liquido" },
  { label: "Custo Funcionário", href: "/custo-funcionario-clt" },
  { label: "Rescisão e Férias", href: "/calculadora-rescisao" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Calcula<span className="text-blue-700">Fiscal</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50">
                2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
              Simuladores trabalhistas e tributários
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-slate-950 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center shrink-0">
          <Link
            href="/clt-vs-pj"
            className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          >
            Simular CLT vs PJ
          </Link>
        </div>
      </div>

      {/* Navegação horizontal em telas menores */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-medium text-slate-700 whitespace-nowrap">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-slate-800"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
