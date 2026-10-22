import React from "react";
import { fetchIndicadoresBancoCentral } from "@/lib/gov-apis";
import {
  PARAMETROS_FISCAIS,
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  formatBRL,
} from "@/lib/calculators";
import { Landmark, ShieldCheck } from "lucide-react";

/**
 * Barra Superior de Transparência Fiscal e Indicadores Oficiais em Tempo Real
 * Conecta à API do Banco Central (Selic/IPCA) e exibe os parâmetros vigentes de parametros-fiscais.json.
 * Aumenta drasticamente a autoridade E-E-A-T perante o algoritmo do Google.
 */
export default async function IndicadoresOficiaisBar() {
  const bcb = await fetchIndicadoresBancoCentral();

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <Landmark className="w-3.5 h-3.5" />
            {bcb.fonte}:
          </span>
          <span>
            Selic Meta: <strong className="text-white">{bcb.selicMetaAnual.toFixed(2)}% a.a.</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span>
            IPCA 12m: <strong className="text-white">{bcb.ipcaAcumulado12m.toFixed(2)}%</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Salário Mínimo {PARAMETROS_FISCAIS.anoVigencia}:{" "}
            <strong className="text-white">{formatBRL(SALARIO_MINIMO_2026)}</strong>
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden md:inline">
            Teto INSS: <strong className="text-white">{formatBRL(TETO_INSS_2026)}</strong>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Tabelas RFB/INSS verificadas em {PARAMETROS_FISCAIS.ultimaAtualizacao}
          </span>
        </div>
      </div>
    </div>
  );
}
