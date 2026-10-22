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
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  Zap,
  Gauge,
} from "lucide-react";

const PRESETS_FATURAMENTO = [
  { label: "NF R$ 8.000/mês", mensal: 8000, rbt12: 96000, fs11: 24640 },
  { label: "NF R$ 15.000/mês", mensal: 15000, rbt12: 180000, fs11: 46200 },
  { label: "NF R$ 25.000/mês", mensal: 25000, rbt12: 300000, fs11: 77000 },
  { label: "NF R$ 45.000/mês", mensal: 45000, rbt12: 540000, fs11: 138600 },
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

  // Cálculo do Fator R real
  const rbt12Base =
    modo === "mensal" ? Math.max(faturamentoMensal * 12, 1) : Math.max(rbt12, 1);

  const fs12Total =
    modo === "mensal"
      ? folhaAtualMensal * 12
      : folha11MesesAnteriores + folhaAtualMensal;

  const fatorRAtual = fs12Total / rbt12Base;
  const atingiu28 = fatorRAtual >= 0.28;

  // Quanto precisa de folha/pró-labore para cravar 28,00%
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

  // Comparativo Financeiro: Com Fator R (Anexo III) vs Sem Fator R (Anexo V c/ salário mínimo)
  const aliqAnexoIII = getAliquotaEfetivaAnexo("III", rbt12Base);
  const aliqAnexoV = getAliquotaEfetivaAnexo("V", rbt12Base);

  // Cenário 1: Com Fator R (28% de Pró-Labore -> Anexo III)
  const dasAnexoIII = faturamentoMensal * aliqAnexoIII;
  const inssComFatorR = Math.min(proLaboreIdealNesteMes, TETO_INSS_2026) * 0.11;
  const irpfComFatorR = calculateIRPF2026(
    proLaboreIdealNesteMes,
    inssComFatorR,
    0,
    0
  ).valor;
  const custoTotalComFatorR = dasAnexoIII + inssComFatorR + irpfComFatorR;

  // Cenário 2: Sem Fator R (Pró-Labore de 1 Salário Mínimo -> Anexo V)
  const dasAnexoV = faturamentoMensal * aliqAnexoV;
  const inssSemFatorR = SALARIO_MINIMO_2026 * 0.11;
  const irpfSemFatorR = 0; // Salário mínimo é isento de IRPF
  const custoTotalSemFatorR = dasAnexoV + inssSemFatorR + irpfSemFatorR;

  // Cenário Atual Digitado pelo Usuário
  const dasCenarioAtual =
    faturamentoMensal * (atingiu28 ? aliqAnexoIII : aliqAnexoV);
  const inssCenarioAtual = Math.min(folhaAtualMensal, TETO_INSS_2026) * 0.11;
  const irpfCenarioAtual = calculateIRPF2026(
    folhaAtualMensal,
    inssCenarioAtual,
    0,
    0
  ).valor;
  const custoTotalCenarioAtual =
    dasCenarioAtual + inssCenarioAtual + irpfCenarioAtual;

  const economiaLiquidaMensal = Math.max(
    0,
    custoTotalSemFatorR - custoTotalComFatorR
  );

  const copiarDiagnostico = () => {
    const texto = `📊 *Diagnóstico Fator R Simples Nacional 2026 (CalculaFiscal)*\n• Faturamento Mensal: ${formatBRL(
      faturamentoMensal
    )} (RBT12: ${formatBRL(rbt12Base)})\n• Fator R Atual: ${formatPercent(
      fatorRAtual
    )} -> Enquadrado no *Anexo ${atingiu28 ? "III (Reduzido)" : "V (15,5%+)"}*\n• Pró-Labore Ideal (28%): ${formatBRL(
      proLaboreIdealNesteMes
    )}\n• Custo Total no Anexo III (DAS + INSS + IR): ${formatBRL(
      custoTotalComFatorR
    )}/mês\n• Custo Total no Anexo V: ${formatBRL(
      custoTotalSemFatorR
    )}/mês\n• 💰 Economia Líquida Anual com Fator R: *${formatBRL(
      economiaLiquidaMensal * 12
    )}/ano*`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-7">
      {/* Seletor de Modo + Atalhos Rápidos */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setModo("mensal")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                modo === "mensal"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚡ Simulação Mensal Rápida
            </button>
            <button
              type="button"
              onClick={() => setModo("auditoria12m")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                modo === "auditoria12m"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔎 Auditoria 12 Meses (RBT12 vs FS12)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-slate-400 mr-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
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
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  faturamentoMensal === p.mensal
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Faturamento Bruto deste Mês (Nota Fiscal R$)
              </label>
              <input
                type="number"
                step={500}
                min={1000}
                value={faturamentoMensal}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setFaturamentoMensal(val);
                  if (modo === "mensal") {
                    setRbt12(val * 12);
                  }
                }}
                className="w-full px-4 py-3 text-xl font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <input
                type="range"
                min={2000}
                max={80000}
                step={500}
                value={Math.min(80000, faturamentoMensal)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFaturamentoMensal(val);
                  if (modo === "mensal") setRbt12(val * 12);
                }}
                className="w-full mt-2 accent-blue-600 cursor-pointer"
              />
            </div>

            {modo === "auditoria12m" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receita Bruta Acumulada nos Últimos 12 Meses (RBT12 R$)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={rbt12}
                  onChange={(e) => setRbt12(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold tabular-nums bg-white border border-slate-300 rounded-xl"
                />
              </div>
            )}
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950">
                Seu Pró-Labore + Folha Neste Mês (R$)
              </label>
              <button
                type="button"
                onClick={() =>
                  setFolhaAtualMensal(Math.ceil(proLaboreIdealNesteMes))
                }
                className="text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-sm transition-colors"
              >
                Cravar 28% ({formatBRL(proLaboreIdealNesteMes)})
              </button>
            </div>

            <div>
              <input
                type="number"
                step={100}
                min={0}
                value={folhaAtualMensal}
                onChange={(e) =>
                  setFolhaAtualMensal(Number(e.target.value) || 0)
                }
                className="w-full px-4 py-3 text-xl font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <input
                type="range"
                min={SALARIO_MINIMO_2026}
                max={Math.max(25000, Math.round(faturamentoMensal * 0.5))}
                step={100}
                value={Math.min(
                  Math.max(25000, Math.round(faturamentoMensal * 0.5)),
                  folhaAtualMensal
                )}
                onChange={(e) => setFolhaAtualMensal(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-600 cursor-pointer"
              />
            </div>

            {modo === "auditoria12m" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Soma de Folha + Pró-Labore + INSS dos 11 Meses Anteriores (R$)
                </label>
                <input
                  type="number"
                  step={1000}
                  value={folha11MesesAnteriores}
                  onChange={(e) =>
                    setFolha11MesesAnteriores(Number(e.target.value) || 0)
                  }
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold tabular-nums bg-white border border-slate-300 rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Termômetro Visual de Fator R (Meta de 28,00%) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Medidor Oficial do Fator R (Meta mínima legal: 28,00%)
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold ${
              atingiu28
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            Seu Fator R: {formatPercent(fatorRAtual)} •{" "}
            {atingiu28
              ? "✅ ANEXO III GARANTIDO (6%)"
              : "⚠️ CAIU NO ANEXO V (15,5%)"}
          </span>
        </div>

        <div className="relative pt-2">
          <div className="w-full h-5 rounded-xl bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              style={{
                width: `${Math.min(100, (fatorRAtual / 0.4) * 100)}%`,
              }}
              className={`h-full transition-all duration-300 ${
                atingiu28 ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>
          {/* Marcador da Meta de 28% (28 / 40 = 70% da barra) */}
          <div
            style={{ left: "70%" }}
            className="absolute top-0 bottom-0 border-l-2 border-dashed border-slate-900 flex flex-col items-center"
          >
            <span className="bg-slate-900 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded -mt-1 whitespace-nowrap">
              Meta 28% ({formatBRL(proLaboreIdealNesteMes)})
            </span>
          </div>
        </div>

        {!atingiu28 && (
          <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            💡 <strong>Atenção Contador/Sócio:</strong> Faltam apenas{" "}
            <strong className="font-mono underline">
              {formatBRL(faltaNesteMesPara28)}
            </strong>{" "}
            no seu pró-labore deste mês para atingir os 28% e derrubar a guia DAS de{" "}
            <strong className="font-mono">{formatBRL(dasAnexoV)}</strong> para{" "}
            <strong className="font-mono text-emerald-700">
              {formatBRL(dasAnexoIII)}
            </strong>
            !
          </p>
        )}
      </div>

      <AdSlot
        slotId="fator-r-result"
        format="in-result"
        label="Seu Contador não monitora o Fator R todo mês? Mude Grátis para Contabilidade Digital com Calibragem Automática de 28%"
        estimatedCpc="CPC Médio: R$ 5,40 (Troca de Contador / Contabilidade PJ)"
      />

      {/* Veredito de Economia Anual */}
      <div className="rounded-3xl bg-slate-950 bg-fintech-grid text-white p-6 sm:p-8 border-2 border-emerald-500/80 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Economia Real com Fator R (2026)
              </span>
              <button
                type="button"
                onClick={copiarDiagnostico}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors"
              >
                {copiado ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar p/ Enviar ao Contador
                  </>
                )}
              </button>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Você economiza{" "}
              <span className="font-mono tabular-nums text-emerald-400">
                {formatBRL(economiaLiquidaMensal * 12)}/ano
              </span>{" "}
              ajustando o Pró-Labore para 28%
            </h3>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Graças à <strong>nova isenção de Imposto de Renda até R$ 5.000 em 2026</strong>, tirar um pró-labore de{" "}
              <strong className="font-mono text-white">
                {formatBRL(proLaboreIdealNesteMes)}
              </strong>{" "}
              ficou muito mais barato: você paga apenas{" "}
              <strong className="font-mono text-white">
                {formatBRL(inssComFatorR)} de INSS
              </strong>{" "}
              e{" "}
              <strong className="font-mono text-emerald-300">
                {formatBRL(irpfComFatorR)} de IRRF
              </strong>
              , economizando{" "}
              <strong className="font-mono text-emerald-400">
                {formatBRL(dasAnexoV - dasAnexoIII)}/mês
              </strong>{" "}
              na guia DAS do Simples Nacional!
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 min-w-[250px] border border-white/15 shrink-0">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300">
              Economia Líquida Todo Mês
            </span>
            <p className="text-3xl font-mono font-bold tabular-nums text-emerald-400 mt-1">
              + {formatBRL(economiaLiquidaMensal)}
            </p>
            <span className="text-xs text-slate-300 block mt-1">
              Já descontando INSS e IRPF do pró-labore!
            </span>
          </div>
        </div>
      </div>

      {/* Comparativo Lado a Lado: Com Fator R (Anexo III) vs Sem Fator R (Anexo V) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border-2 border-emerald-500/70 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Com Fator R ≥ 28% (Anexo III)
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
              Alíquota DAS: {formatPercent(aliqAnexoIII)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Pró-Labore Mensal (28%)</span>
              <span className="font-mono font-semibold tabular-nums">
                {formatBRL(proLaboreIdealNesteMes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Guia DAS Simples (Anexo III)</span>
              <span className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(dasAnexoIII)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">INSS sobre Pró-Labore (11%)</span>
              <span className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(inssComFatorR)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">IRRF sobre Pró-Labore (Tabela 2026)</span>
              <span className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(irpfComFatorR)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-100 font-extrabold text-base text-slate-900">
              <span>Total de Impostos no Mês</span>
              <span className="font-mono tabular-nums text-emerald-700">
                {formatBRL(custoTotalComFatorR)} (
                {formatPercent(custoTotalComFatorR / Math.max(1, faturamentoMensal))})
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 opacity-90">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Sem Fator R &lt; 28% (Anexo V)
            </span>
            <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg">
              Alíquota DAS: {formatPercent(aliqAnexoV)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Pró-Labore Mínimo</span>
              <span className="font-mono font-semibold tabular-nums">
                {formatBRL(SALARIO_MINIMO_2026)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Guia DAS Simples (Anexo V)</span>
              <span className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(dasAnexoV)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">INSS sobre Salário Mínimo (11%)</span>
              <span className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(inssSemFatorR)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">IRRF sobre Pró-Labore</span>
              <span className="font-mono font-semibold tabular-nums text-slate-500">
                R$ 0,00 (Isento)
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-100 font-extrabold text-base text-slate-900">
              <span>Total de Impostos no Mês</span>
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
