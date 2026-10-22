import React from "react";
import Link from "next/link";
import SnowballLinks from "@/components/SnowballLinks";
import { Calculator, Briefcase, FileSpreadsheet, TrendingUp, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="space-y-10 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm max-w-3xl mx-auto space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Calculator className="w-7 h-7" />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600">
          Erro 404 • Página Não Encontrada
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Ops! Esse endereço mudou ou não existe, mas suas calculadoras estão aqui:
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Escolha uma das ferramentas oficiais atualizadas para 2026 abaixo para continuar sua simulação sem perder tempo:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
          <Link
            href="/clt-vs-pj"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 transition-all flex items-center gap-3"
          >
            <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Simulador CLT vs PJ 2026
              </strong>
              <span className="text-xs text-slate-500">
                Descubra o ponto de equilíbrio exato
              </span>
            </div>
          </Link>

          <Link
            href="/cnae"
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all flex items-center gap-3"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Tabela CNAE & Simples Nacional
              </strong>
              <span className="text-xs text-slate-500">
                Consulte Anexo, MEI e Reforma 2026
              </span>
            </div>
          </Link>

          <Link
            href="/calculadora-fator-r"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/40 transition-all flex items-center gap-3"
          >
            <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Calculadora de Fator R (28%)
              </strong>
              <span className="text-xs text-slate-500">
                Caia de 15,5% (Anexo V) para 6% (Anexo III)
              </span>
            </div>
          </Link>

          <Link
            href="/custo-funcionario-clt"
            className="p-4 rounded-xl border border-slate-200 hover:border-amber-600 hover:bg-amber-50/40 transition-all flex items-center gap-3"
          >
            <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Custo de Funcionário CLT
              </strong>
              <span className="text-xs text-slate-500">
                Simples Nacional, MEI e Lucro Presumido
              </span>
            </div>
          </Link>
        </div>
      </div>

      <SnowballLinks currentSalary={8000} />
    </div>
  );
}
