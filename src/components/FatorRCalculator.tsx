"use client";

import React, { useState } from "react";
import {
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  TABELAS_SIMPLES_2026,
  calculateIRPF2026,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import PrintButton from "./PrintButton";
import { Check, Copy, AlertTriangle, CheckCircle2 } from "lucide-react";

const PRESETS_FATURAMENTO = [
  { label: "R$ 8.000/mês", mensal: 8000, rbt12: 96000, fs11: 24640 },
  { label: "R$ 15.000/mês", mensal: 15000, rbt12: 180000, fs11: 46200 },
  { label: "R$ 25.000/mês", mensal: 25000, rbt12: 300000, fs11: 77000 },
  { label: "R$ 45.000/mês", mensal: 45000, rbt12: 540000, fs11: 138600 },
];

function getAliquotaEfetivaAnexo(anexo: "III" | "V", rbt12: number): number {
  const rbtEfetivo = Math.max(1, rbt12);
  const tabela = TABELAS_SIMPLES_2026[anexo];
  const faixa =
    tabela.find((f) => rbtEfetivo <= f.limiteSuperior) ||
    tabela[tabela.length - 1];
  return Math.max(
    0,
    (rbtEfetivo * faixa.aliquotaNominal - faixa.parcelaDeduzir) / rbtEfetivo
  );
}

export default function FatorRCalculator() {
  const [modo, setModo] = useState<"mensal" | "auditoria12m">("mensal");
  const [faturamentoMensal, setFaturamentoMensal] = useState<number>(15000);
  const [rbt12, setRbt12] = useState<number>(180000);
  const [folhaAtualMensal, setFolhaAtualMensal] = useState<number>(4250);
  const [folha11MesesAnteriores, setFolha11MesesAnteriores] =
    useState<number>(46200);
  const [copiado, setCopiado] = useState<boolean>(false);

  const rbt12Base =
    modo === "mensal" ? Math.max(faturamentoMensal * 12, 1) : Math.max(rbt12, 1);

  const fs12Total =
    modo === "mensal"
      ? folhaAtualMensal * 12
      : folha11MesesAnteriores + folhaAtualMensal;

  const fatorRAtual = fs12Total / rbt12Base;
  const atingiu28 = fatorRAtual >= 0.28;

  const folhaAnualNecessaria28 = rbt12Base * 0.28;
  const proLaboreIdealNesteMes =
    modo === "mensal"
      ? Math.max(SALARIO_MINIMO_2026, faturamentoMensal * 0.28)
      : Math.max(
          SALARIO_MINIMO_2026,
          folhaAnualNecessaria28 - folha11MesesAnteriores
        );

  const faltaNesteMesPara28 = Math.max(
    0,
    proLaboreIdealNesteMes - folhaAtualMensal
  );

  const aliqAnexoIII = getAliquotaEfetivaAnexo("III", rbt12Base);
  const aliqAnexoV = getAliquotaEfetivaAnexo("V", rbt12Base);

  const dasAnexoIII = faturamentoMensal * aliqAnexoIII;
  const inssComFatorR = Math.min(proLaboreIdealNesteMes, TETO_INSS_2026) * 0.11;
  const irpfComFatorR = calculateIRPF2026(
    proLaboreIdealNesteMes,
    inssComFatorR,
    0,
    0
  ).valor;
  const custoTotalComFatorR = dasAnexoIII + inssComFatorR + irpfComFatorR;

  const dasAnexoV = faturamentoMensal * aliqAnexoV;
  const inssSemFatorR = SALARIO_MINIMO_2026 * 0.11;
  const irpfSemFatorR = 0;
  const custoTotalSemFatorR = dasAnexoV + inssSemFatorR + irpfSemFatorR;

  const economiaLiquidaMensal = Math.max(
    0,
    custoTotalSemFatorR - custoTotalComFatorR
  );

  const copiarDiagnostico = () => {
    const texto = `Resumo Fator R 2026 (CalculaFiscal)\n- Faturamento mensal: ${formatBRL(
      faturamentoMensal
    )} (RBT12: ${formatBRL(rbt12Base)})\n- Fator R apurado: ${formatPercent(
      fatorRAtual
    )} (Anexo ${atingiu28 ? "III" : "V"})\n- Pró-labore para atingir 28%: ${formatBRL(
      proLaboreIdealNesteMes
    )}\n- Total no Anexo III (DAS + INSS + IRRF): ${formatBRL(
      custoTotalComFatorR
    )}/mês\n- Total no Anexo V: ${formatBRL(
      custoTotalSemFatorR
    )}/mês\n- Economia líquida anual estimada: ${formatBRL(
      economiaLiquidaMensal * 12
    )}/ano`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setModo("mensal")}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                modo === "mensal"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Simulação mensal rápida
            </button>
            <button
              type="button"
              onClick={() => setModo("auditoria12m")}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                modo === "auditoria12m"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Auditoria 12 meses (RBT12 e FS12)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 mr-1">
              Exemplos:
            </span>
            {PRESETS_FATURAMENTO.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setFaturamentoMensal(p.mensal);
                  setRbt12(p.rbt12);
                  setFolha11MesesAnteriores(p.fs11);
                  setFolhaAtualMensal(Math.round(p.mensal * 0.28));
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-colors ${
                  faturamentoMensal === p.mensal
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div className="space-y-4 p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <label
                htmlFor="fatorr-faturamento"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Faturamento bruto no mês (R$)
              </label>
              <input
                id="fatorr-faturamento"
                type="number"
                step={500}
                min={0}
                value={faturamentoMensal}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value) || 0);
                  setFaturamentoMensal(val);
                  if (modo === "mensal") {
                    setRbt12(val * 12);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:outline-none"
              />
              <input
                type="range"
                aria-label="Ajustar faturamento mensal"
                min={2000}
                max={80000}
                step={500}
                value={Math.min(80000, faturamentoMensal)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFaturamentoMensal(val);
                  if (modo === "mensal") setRbt12(val * 12);
                }}
                className="no-print w-full mt-2 accent-blue-700 cursor-pointer"
              />
            </div>

            {modo === "auditoria12m" && (
              <div>
                <label
                  htmlFor="fatorr-rbt12"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Receita bruta dos últimos 12 meses — RBT12 (R$)
                </label>
                <input
                  id="fatorr-rbt12"
                  type="number"
                  step={5000}
                  min={0}
                  value={rbt12}
                  onChange={(e) =>
                    setRbt12(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold tabular-nums bg-white border border-slate-300 rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="fatorr-folha"
                className="block text-xs font-semibold text-slate-700"
              >
                Pró-labore + folha do mês (R$)
              </label>
              <button
                type="button"
                onClick={() =>
                  setFolhaAtualMensal(Math.ceil(proLaboreIdealNesteMes))
                }
                className="no-print text-[11px] font-semibold text-blue-700 bg-white hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-300 transition-colors"
              >
                Ajustar para 28% ({formatBRL(proLaboreIdealNesteMes)})
              </button>
            </div>

            <div>
              <input
                id="fatorr-folha"
                type="number"
                step={100}
                min={0}
                value={folhaAtualMensal}
                onChange={(e) =>
                  setFolhaAtualMensal(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:outline-none"
              />
              <input
                type="range"
                aria-label="Ajustar pró-labore e folha do mês"
                min={SALARIO_MINIMO_2026}
                max={Math.max(25000, Math.round(faturamentoMensal * 0.5))}
                step={100}
                value={Math.min(
                  Math.max(25000, Math.round(faturamentoMensal * 0.5)),
                  folhaAtualMensal
                )}
                onChange={(e) => setFolhaAtualMensal(Number(e.target.value))}
                className="no-print w-full mt-2 accent-emerald-700 cursor-pointer"
              />
            </div>

            {modo === "auditoria12m" && (
              <div>
                <label
                  htmlFor="fatorr-fs11"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Folha + pró-labore + encargos dos 11 meses anteriores (R$)
                </label>
                <input
                  id="fatorr-fs11"
                  type="number"
                  step={1000}
                  min={0}
                  value={folha11MesesAnteriores}
                  onChange={(e) =>
                    setFolha11MesesAnteriores(
                      Math.max(0, Number(e.target.value) || 0)
                    )
                  }
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold tabular-nums bg-white border border-slate-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra da Trava Legal de 28% */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            Proporção apurada (gatilho legal de 28,00%)
          </h3>
          <span
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
              atingiu28
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            Fator R: {formatPercent(fatorRAtual)} ·{" "}
            {atingiu28 ? "Anexo III" : "Anexo V"}
          </span>
        </div>

        <div className="relative pt-2">
          <div className="w-full h-4 rounded bg-slate-100 overflow-hidden flex">
            <div
              style={{
                width: `${Math.min(100, (fatorRAtual / 0.4) * 100)}%`,
              }}
              className={`h-full transition-all duration-300 ${
                atingiu28 ? "bg-emerald-600" : "bg-amber-600"
              }`}
            />
          </div>
          <div
            style={{ left: "70%" }}
            className="absolute top-0 bottom-0 border-l-2 border-dashed border-slate-700 flex flex-col items-center"
          >
            <span className="bg-slate-900 text-white text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded -mt-1 whitespace-nowrap">
              28% ({formatBRL(proLaboreIdealNesteMes)})
            </span>
          </div>
        </div>

        {!atingiu28 && (
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Faltam{" "}
            <strong className="font-mono">
              {formatBRL(faltaNesteMesPara28)}
            </strong>{" "}
            na folha ou pró-labore deste mês para atingir 28% e reduzir a guia DAS de{" "}
            <strong className="font-mono">{formatBRL(dasAnexoV)}</strong> para{" "}
            <strong className="font-mono text-emerald-800">
              {formatBRL(dasAnexoIII)}
            </strong>
            .
          </p>
        )}
      </div>

      <AdSlot
        slotId="fator-r-result"
        format="in-result"
        label="Contabilidade digital especializada no monitoramento mensal do Fator R (Anexo III)"
        estimatedCpc="CPC Médio: R$ 5,40 (Troca de Contador / Contabilidade PJ)"
      />

      {/* Resumo de Economia Anual */}
      <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-emerald-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                Economia estimada com Fator R
              </span>
              <button
                type="button"
                onClick={copiarDiagnostico}
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
                    Copiar resumo
                  </>
                )}
              </button>
              <PrintButton />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Economia líquida de{" "}
              <span className="font-mono tabular-nums text-emerald-700">
                {formatBRL(economiaLiquidaMensal * 12)}/ano
              </span>{" "}
              ajustando o pró-labore para 28%
            </h3>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Com a faixa de isenção do IRPF até R$ 5.000 em 2026, um pró-labore de{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(proLaboreIdealNesteMes)}
              </strong>{" "}
              recolhe{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(inssComFatorR)} de INSS
              </strong>{" "}
              e{" "}
              <strong className="font-mono text-emerald-700">
                {formatBRL(irpfComFatorR)} de IRRF
              </strong>
              , reduzindo a guia DAS em{" "}
              <strong className="font-mono text-emerald-700">
                {formatBRL(dasAnexoV - dasAnexoIII)}/mês
              </strong>
              .
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-5 min-w-[240px] border border-slate-200 shrink-0">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
              Economia líquida por mês
            </span>
            <p className="text-3xl font-mono font-bold tabular-nums text-emerald-700 mt-1">
              + {formatBRL(economiaLiquidaMensal)}
            </p>
            <span className="text-xs text-slate-500 block mt-1">
              Já descontando INSS e IRRF do pró-labore
            </span>
          </div>
        </div>
      </div>

      {/* Comparativo Anexo III vs Anexo V */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-emerald-700 p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Com Fator R ≥ 28% (Anexo III)
            </span>
            <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              DAS: {formatPercent(aliqAnexoIII)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Pró-labore mensal (28%)</span>
              <span className="font-mono font-semibold tabular-nums">
                {formatBRL(proLaboreIdealNesteMes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Guia DAS (Anexo III)</span>
              <span className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(dasAnexoIII)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">INSS sobre pró-labore (11%)</span>
              <span className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(inssComFatorR)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">IRRF sobre pró-labore</span>
              <span className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(irpfComFatorR)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-base text-slate-900">
              <span>Total de tributos no mês</span>
              <span className="font-mono tabular-nums text-emerald-700">
                {formatBRL(custoTotalComFatorR)} (
                {formatPercent(custoTotalComFatorR / Math.max(1, faturamentoMensal))})
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              Sem Fator R &lt; 28% (Anexo V)
            </span>
            <span className="text-xs font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
              DAS: {formatPercent(aliqAnexoV)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Pró-labore mínimo</span>
              <span className="font-mono font-semibold tabular-nums">
                {formatBRL(SALARIO_MINIMO_2026)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Guia DAS (Anexo V)</span>
              <span className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(dasAnexoV)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">INSS sobre salário mínimo (11%)</span>
              <span className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(inssSemFatorR)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">IRRF sobre pró-labore</span>
              <span className="font-mono font-medium tabular-nums text-slate-500">
                R$ 0,00 (isento)
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-base text-slate-900">
              <span>Total de tributos no mês</span>
              <span className="font-mono tabular-nums text-rose-700">
                {formatBRL(custoTotalSemFatorR)} (
                {formatPercent(custoTotalSemFatorR / Math.max(1, faturamentoMensal))})
              </span>
            </div>
          </div>
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
