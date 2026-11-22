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
import { ArrowRight } from "lucide-react";

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
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Salário bruto mensal na carteira (R$)
            </label>
            <input
              type="number"
              step={250}
              min={1621}
              value={salarioBruto}
              onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
            />
            <input
              type="range"
              min={1621}
              max={30000}
              step={250}
              value={Math.min(30000, salarioBruto)}
              onChange={(e) => setSalarioBruto(Number(e.target.value))}
              className="w-full mt-2.5 accent-blue-700 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dependentes IRPF
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={dependentes}
                onChange={(e) => setDependentes(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Outros descontos (R$)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={outrosDescontos}
                onChange={(e) =>
                  setOutrosDescontos(Number(e.target.value) || 0)
                }
                className="w-full px-3 py-2 text-sm font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <label className="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={descontarVT}
                onChange={(e) => setDescontarVT(e.target.checked)}
                className="w-4 h-4 accent-blue-700 rounded"
              />
              Descontar Vale-Transporte (até 6%)
            </label>
          </div>
        </div>
      </div>

      <AdSlot
        slotId="salario-liquido-result"
        format="in-result"
        label="Portabilidade salarial gratuita e crédito consignado CLT 2026"
        estimatedCpc="CPC Médio: R$ 3,60 (Bancos Digitais / Crédito CLT)"
      />

      <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-700 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Resultado estimado · Tabelas INSS e IRRF 2026
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
            {formatBRL(res.salarioLiquidoMensal)}{" "}
            <span className="text-sm font-sans font-medium text-slate-500">
              líquidos por mês
            </span>
          </h3>
          {res.isentoNovaRegra5k && (
            <p className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded mt-2">
              Isento de IRRF pela regra de 2026 (remuneração até R$ 5.000)
            </p>
          )}
        </div>

        <Link
          href={`/clt-vs-pj/salario/${Math.min(30000, Math.max(2500, Math.round(salarioBruto / 500) * 500))}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white transition-colors shrink-0"
        >
          Comparar {formatBRL(salarioBruto)} como PJ
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="font-bold text-base text-slate-900 mb-4 border-b border-slate-200 pb-3">
          Demonstrativo do holerite (2026)
        </h4>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">Salário bruto</span>
            <span className="font-mono font-bold text-slate-900">
              {formatBRL(
                res.salarioLiquidoMensal +
                  res.inss +
                  res.irpf +
                  res.valeTransporteDesconto +
                  res.outrosDescontos
              )}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              INSS progressivo (alíquota efetiva{" "}
              {formatPercent(inssDetalhe.aliquotaEfetiva)})
            </span>
            <span className="font-mono font-medium text-rose-700">
              - {formatBRL(res.inss)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              IRRF retido na fonte (desconto {res.metodoIR})
            </span>
            <span className="font-mono font-medium text-rose-700">
              - {formatBRL(res.irpf)}
            </span>
          </div>
          {res.valeTransporteDesconto > 0 && (
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Vale-Transporte (6%)</span>
              <span className="font-mono font-medium text-rose-700">
                - {formatBRL(res.valeTransporteDesconto)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-3 font-bold text-base text-slate-900">
            <span>Salário líquido a receber</span>
            <span className="font-mono text-emerald-700">
              {formatBRL(res.salarioLiquidoMensal)}
            </span>
          </div>
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
