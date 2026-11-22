import React from "react";
import Link from "next/link";
import SnowballLinks from "@/components/SnowballLinks";
import { Briefcase, FileSpreadsheet, TrendingUp, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="space-y-8 py-4">
      <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10 max-w-3xl mx-auto space-y-5">
        <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Erro 404 · Endereço não encontrado
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Esta página não existe ou foi movida
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          O endereço acessado não está disponível. Selecione uma das ferramentas abaixo ou acesse a{" "}
          <Link href="/" className="text-blue-700 font-semibold underline">
            página inicial
          </Link>{" "}
          para continuar sua simulação.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          <Link
            href="/clt-vs-pj"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors flex items-center gap-3"
          >
            <Briefcase className="w-5 h-5 text-slate-700 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Simulador CLT vs PJ 2026
              </strong>
              <span className="text-xs text-slate-500">
                Ponto de equilíbrio e impostos no CNPJ
              </span>
            </div>
          </Link>

          <Link
            href="/cnae"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors flex items-center gap-3"
          >
            <FileSpreadsheet className="w-5 h-5 text-slate-700 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Tabela CNAE e Simples Nacional
              </strong>
              <span className="text-xs text-slate-500">
                Anexo, MEI, Fator R e transição CBS/IBS
              </span>
            </div>
          </Link>

          <Link
            href="/calculadora-fator-r"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors flex items-center gap-3"
          >
            <TrendingUp className="w-5 h-5 text-slate-700 shrink-0" />
            <div>
              <strong className="text-sm text-slate-900 block">
                Calculadora de Fator R (28%)
              </strong>
              <span className="text-xs text-slate-500">
                Enquadramento no Anexo III a partir de 6%
              </span>
            </div>
          </Link>

          <Link
            href="/custo-funcionario-clt"
            className="p-4 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors flex items-center gap-3"
          >
            <Building2 className="w-5 h-5 text-slate-700 shrink-0" />
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
