import React from "react";
import Link from "next/link";
import { Calculator, FileSpreadsheet, Briefcase, TrendingUp, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Calcula<span className="text-blue-600">Fiscal</span>
            </span>
            <span className="ml-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 align-middle">
              2026
            </span>
            <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
              Impostos, CLT vs PJ, CNAE e Reforma Tributária
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-700">
          <Link
            href="/clt-vs-pj"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <Briefcase className="w-4 h-4 text-blue-600" />
            CLT vs PJ 2026
          </Link>
          <Link
            href="/cnae"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Tabela CNAE & Fator R
          </Link>
          <Link
            href="/calculadora-salario-liquido"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Salário Líquido
          </Link>
          <Link
            href="/calculadora-rescisao"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Rescisão & Férias
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/clt-vs-pj"
            className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            Simular Agora
          </Link>
        </div>
      </div>

      {/* Sub-barra mobile para acesso rápido aos 3 Motores */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-medium text-slate-700 whitespace-nowrap">
        <Link href="/clt-vs-pj" className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
          ⚡ CLT vs PJ
        </Link>
        <Link href="/cnae" className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
          📊 Consulta CNAE
        </Link>
        <Link href="/calculadora-salario-liquido" className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
          💰 Salário Líquido 2026
        </Link>
        <Link href="/calculadora-rescisao" className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
          📋 Rescisão & Férias
        </Link>
      </div>
    </header>
  );
}
