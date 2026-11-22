import React from "react";
import { fetchIndicadoresBancoCentral } from "@/lib/gov-apis";
import {
  PARAMETROS_FISCAIS,
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  formatBRL,
} from "@/lib/calculators";

/**
 * Barra superior com indicadores macroeconômicos (Banco Central) e parâmetros vigentes.
 */
export default async function IndicadoresOficiaisBar() {
  const bcb = await fetchIndicadoresBancoCentral();

  return (
    <div className="no-print bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <span className="font-semibold text-slate-100">
            Referência {PARAMETROS_FISCAIS.anoVigencia}:
          </span>
          <span>
            Selic Meta{" "}
            <strong className="text-white font-mono tabular-nums">
              {bcb.selicMetaAnual.toFixed(2)}% a.a.
            </strong>
          </span>
          <span className="text-slate-600">·</span>
          <span>
            IPCA 12m{" "}
            <strong className="text-white font-mono tabular-nums">
              {bcb.ipcaAcumulado12m.toFixed(2)}%
            </strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            Salário Mínimo{" "}
            <strong className="text-white font-mono tabular-nums">
              {formatBRL(SALARIO_MINIMO_2026)}
            </strong>
          </span>
          <span className="text-slate-600 hidden md:inline">·</span>
          <span className="hidden md:inline">
            Teto INSS{" "}
            <strong className="text-white font-mono tabular-nums">
              {formatBRL(TETO_INSS_2026)}
            </strong>
          </span>
        </div>

        <div className="hidden lg:block text-slate-400">
          Fontes: {bcb.fonte} e Receita Federal · Revisão {PARAMETROS_FISCAIS.ultimaAtualizacao}
        </div>
      </div>
    </div>
  );
}
