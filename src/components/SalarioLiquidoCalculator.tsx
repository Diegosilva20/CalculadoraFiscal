"use client";

import React, { useState } from "react";
import {
  calculateINSS2026,
  calculateSalarioLiquidoCLT,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function SalarioLiquidoCalculator({
  initialSalario = 5000,
}: {
  initialSalario?: number;
}) {
  const [salarioBruto, setSalarioBruto] = useState<number>(initialSalario);
  const [dependentes, setDependentes] = useState<number>(0);
  const [outrosDescontos, setOutrosDescontos] = useState<number>(0);
  const [descontarVT, setDescontarVT] = useState<boolean>(false);

  const res = calculateSalarioLiquidoCLT({
    salarioBruto,
    dependentes,
    outrosDescontos,
    descontarVT,
  });

  const inssDetalhe = calculateINSS2026(salarioBruto);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Salário Bruto Mensal na Carteira (R$)
            </label>
            <input
              type="number"
              step={250}
              min={1621}
              value={salarioBruto}
              onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xl font-extrabold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <input
              type="range"
              min={1621}
              max={30000}
              step={250}
              value={Math.min(30000, salarioBruto)}
              onChange={(e) => setSalarioBruto(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nº Dependentes
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={dependentes}
                onChange={(e) => setDependentes(Number(e.target.value) || 0)}
                className="w-full px-3 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Outros Descontos (R$)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={outrosDescontos}
                onChange={(e) =>
                  setOutrosDescontos(Number(e.target.value) || 0)
                }
                className="w-full px-3 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <label className="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={descontarVT}
                onChange={(e) => setDescontarVT(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Descontar Vale-Transporte (6%)
            </label>
          </div>
        </div>
      </div>

      <AdSlot
        slotId="salario-liquido-result"
        format="in-result"
        label="Simule Empréstimo Consignado CLT ou Portabilidade Salarial com Taxa Reduzida 2026"
        estimatedCpc="CPC Médio: R$ 3,60 (Bancos Digitais / Crédito CLT)"
      />

      {/* Resultado Principal */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Resultado Oficial • Tabela INSS e IRRF 2026
          </span>
          <h3 className="text-3xl sm:text-4xl font-black mt-1">
            {formatBRL(res.salarioLiquidoMensal)}{" "}
            <span className="text-base font-medium text-slate-400">
              líquidos/mês
            </span>
          </h3>
          {res.isentoNovaRegra5k && (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/90 border border-emerald-700 px-3 py-1 rounded-full mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Isento de Imposto de Renda pela Nova Regra 2026 (Salários até R$ 5.000)!
            </p>
          )}
        </div>

        <Link
          href={`/clt-vs-pj/salario/${Math.min(30000, Math.max(2500, Math.round(salarioBruto / 500) * 500))}`}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm font-bold text-white transition-colors shrink-0"
        >
          Ver quanto {formatBRL(salarioBruto)} equivale como PJ
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabela Discriminada */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="font-bold text-base text-slate-900 mb-4">
          Detalhamento do Holerite (Contracheque 2026)
        </h4>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">Salário Bruto</span>
            <span className="font-bold text-slate-900">
              {formatBRL(res.salarioLiquidoMensal + res.inss + res.irpf + res.valeTransporteDesconto + res.outrosDescontos)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              (-) INSS Progressivo 2026 (Alíquota efetiva:{" "}
              {formatPercent(inssDetalhe.aliquotaEfetiva)})
            </span>
            <span className="font-semibold text-rose-600">
              - {formatBRL(res.inss)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              (-) Imposto de Renda Retido na Fonte (IRRF 2026 • Desconto{" "}
              {res.metodoIR})
            </span>
            <span className="font-semibold text-rose-600">
              - {formatBRL(res.irpf)}
            </span>
          </div>
          {res.valeTransporteDesconto > 0 && (
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">(-) Vale-Transporte (6%)</span>
              <span className="font-semibold text-rose-600">
                - {formatBRL(res.valeTransporteDesconto)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-3 font-extrabold text-base text-slate-900">
            <span>Salário Líquido a Receber</span>
            <span className="text-emerald-700">
              {formatBRL(res.salarioLiquidoMensal)}
            </span>
          </div>
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
