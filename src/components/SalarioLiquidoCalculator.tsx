"use client";

import React, { useState } from "react";
import {
  calculateINSS2026,
  calculateSalarioLiquidoCLT,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import { getNearestSalarioSEO } from "@/data/profissoes";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import PrintButton from "./PrintButton";
import Link from "next/link";
import { ArrowRight, Copy, Check } from "lucide-react";

const PRESETS_SALARIO = [2500, 3500, 5000, 8500, 15000];

export default function SalarioLiquidoCalculator({
  initialSalario = 5000,
}: {
  initialSalario?: number;
}) {
  const [salarioBruto, setSalarioBruto] = useState<number>(initialSalario);
  const [dependentes, setDependentes] = useState<number>(0);
  const [outrosDescontos, setOutrosDescontos] = useState<number>(0);
  const [descontarVT, setDescontarVT] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  const res = calculateSalarioLiquidoCLT({
    salarioBruto,
    dependentes,
    outrosDescontos,
    descontarVT,
  });

  const inssDetalhe = calculateINSS2026(salarioBruto);
  const faixaCanonicalPJ = getNearestSalarioSEO(salarioBruto);

  const copiarHolerite = () => {
    const texto = `Salário Líquido 2026 (CalculaFiscal)\n- Salário Bruto: ${formatBRL(
      res.salarioBruto
    )}\n- INSS Progressivo: -${formatBRL(res.inss)} (${formatPercent(
      inssDetalhe.aliquotaEfetiva
    )})\n- IRRF (${res.metodoIR}): -${formatBRL(res.irpf)}${
      res.valeTransporteDesconto > 0
        ? `\n- Vale-Transporte: -${formatBRL(res.valeTransporteDesconto)}`
        : ""
    }${
      res.outrosDescontos > 0
        ? `\n- Outros descontos: -${formatBRL(res.outrosDescontos)}`
        : ""
    }\n- Salário Líquido: ${formatBRL(res.salarioLiquidoMensal)}`;
    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <span className="text-xs font-semibold text-slate-600">
            Exemplos rápidos de salário bruto:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS_SALARIO.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSalarioBruto(v)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                  salarioBruto === v
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                R$ {v.toLocaleString("pt-BR")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label
              htmlFor="liq-salario-bruto"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Salário bruto mensal na carteira (R$)
            </label>
            <input
              id="liq-salario-bruto"
              type="number"
              step={250}
              min={0}
              value={salarioBruto}
              onChange={(e) =>
                setSalarioBruto(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
            />
            <input
              type="range"
              aria-label="Ajustar salário bruto CLT"
              min={1621}
              max={30000}
              step={250}
              value={Math.min(30000, salarioBruto)}
              onChange={(e) => setSalarioBruto(Number(e.target.value))}
              className="no-print w-full mt-2.5 accent-blue-700 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="liq-dependentes"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Dependentes IRPF
              </label>
              <input
                id="liq-dependentes"
                type="number"
                min={0}
                max={20}
                value={dependentes}
                onChange={(e) =>
                  setDependentes(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full px-3 py-2 text-sm font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="liq-outros"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Outros descontos (R$)
              </label>
              <input
                id="liq-outros"
                type="number"
                min={0}
                step={50}
                value={outrosDescontos}
                onChange={(e) =>
                  setOutrosDescontos(Math.max(0, Number(e.target.value) || 0))
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
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resultado estimado · Tabelas INSS e IRRF 2026
            </span>
            <button
              type="button"
              onClick={copiarHolerite}
              className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {copiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar holerite
                </>
              )}
            </button>
            <PrintButton />
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-slate-900">
            {formatBRL(res.salarioLiquidoMensal)}{" "}
            <span className="text-sm font-sans font-medium text-slate-500">
              líquidos por mês
            </span>
          </h3>
          {res.isentoNovaRegra5k && (
            <p className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
              Isento de IRRF pela regra de 2026 (remuneração até R$ 5.000)
            </p>
          )}
        </div>

        <Link
          href={`/clt-vs-pj/salario/${faixaCanonicalPJ}`}
          className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-700 text-xs sm:text-sm font-semibold text-white transition-colors shrink-0"
        >
          Comparar R$ {faixaCanonicalPJ.toLocaleString("pt-BR")} como PJ
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="font-bold text-base text-slate-900 mb-4 border-b border-slate-200 pb-3">
            Demonstrativo do holerite (2026)
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Salário bruto</span>
              <span className="font-mono font-bold text-slate-900">
                {formatBRL(res.salarioBruto)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                INSS progressivo ({formatPercent(inssDetalhe.aliquotaEfetiva)})
              </span>
              <span className="font-mono font-medium text-rose-700">
                - {formatBRL(res.inss)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                IRRF na fonte (critério {res.metodoIR})
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
            {res.outrosDescontos > 0 && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Outros descontos</span>
                <span className="font-mono font-medium text-rose-700">
                  - {formatBRL(res.outrosDescontos)}
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

        {/* Detalhamento progressivo faixa a faixa do INSS */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="font-bold text-base text-slate-900 mb-4 border-b border-slate-200 pb-3">
            Memória de cálculo do INSS por faixa salarial
          </h4>
          {inssDetalhe.faixas.length > 0 ? (
            <div className="space-y-2.5 text-sm">
              {inssDetalhe.faixas.map((fx, i) => (
                <div
                  key={i}
                  className="flex justify-between py-1.5 border-b border-slate-100 text-xs sm:text-sm"
                >
                  <span className="text-slate-600">
                    Faixa {i + 1}: {fx.faixa}
                  </span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatBRL(fx.valor)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 font-bold text-sm text-slate-900">
                <span>Total descontado de INSS</span>
                <span className="font-mono text-rose-700">
                  {formatBRL(res.inss)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Informe um salário bruto acima de R$ 0,00 para visualizar as faixas.
            </p>
          )}
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
