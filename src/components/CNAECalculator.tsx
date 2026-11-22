"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AnexoSimples,
  DAS_MEI_SERVICOS_2026,
  TETO_ANUAL_MEI_2026,
  calculateSimplesNacional2026,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import PrintButton from "./PrintButton";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";

interface CNAECalculatorProps {
  codigoCNAE: string;
  tituloCNAE: string;
  anexoPadrao: AnexoSimples;
  sujeitoFatorR: boolean;
  permiteMEI: boolean;
  reducaoIVA2026: number;
}

const FATURAMENTO_PRESETS = [
  { label: "Faixa MEI", valor: 6500 },
  { label: "R$ 10.000", valor: 10000 },
  { label: "R$ 20.000", valor: 20000 },
  { label: "R$ 35.000", valor: 35000 },
];

export default function CNAECalculator({
  codigoCNAE,
  tituloCNAE,
  anexoPadrao,
  sujeitoFatorR,
  permiteMEI,
  reducaoIVA2026,
}: CNAECalculatorProps) {
  const [faturamentoMensal, setFaturamentoMensal] = useState<number>(12000);
  const [otimizarFatorR, setOtimizarFatorR] = useState<boolean>(true);
  const [rbt12Custom, setRbt12Custom] = useState<string>("");
  const [inssNoTeto, setInssNoTeto] = useState<boolean>(false);

  const rbt12Numerico = Number(rbt12Custom);

  const resultado = calculateSimplesNacional2026({
    faturamentoMensal,
    anexo: anexoPadrao,
    sujeitoFatorR,
    otimizarFatorR,
    reducaoSetorialIVA: reducaoIVA2026,
    rbt12: Number.isFinite(rbt12Numerico) && rbt12Numerico > 0 ? rbt12Numerico : undefined,
    inssJaRecolhidoNoTeto: inssNoTeto,
  });

  const cabeNoMEI = permiteMEI && faturamentoMensal * 12 <= TETO_ANUAL_MEI_2026;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-semibold text-slate-600">
            Simulador Simples Nacional · CNAE {codigoCNAE}
          </span>
          {sujeitoFatorR && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
              Elegível ao Fator R (Anexo III a partir de 6%)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">
            Exemplos de faturamento:
          </span>
          {FATURAMENTO_PRESETS.map((p) => (
            <button
              key={p.valor}
              type="button"
              onClick={() => setFaturamentoMensal(p.valor)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                faturamentoMensal === p.valor
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label
              htmlFor="cnae-faturamento"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Faturamento bruto mensal previsto (R$)
            </label>
            <input
              id="cnae-faturamento"
              type="number"
              step={500}
              min={0}
              value={faturamentoMensal}
              onChange={(e) =>
                setFaturamentoMensal(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
            />
            <input
              type="range"
              aria-label="Ajustar faturamento bruto mensal"
              min={2000}
              max={60000}
              step={500}
              value={Math.min(60000, faturamentoMensal)}
              onChange={(e) => setFaturamentoMensal(Number(e.target.value))}
              className="no-print w-full mt-2.5 accent-blue-700 cursor-pointer"
            />
          </div>

          <div>
            {sujeitoFatorR ? (
              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={otimizarFatorR}
                  onChange={(e) => setOtimizarFatorR(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-emerald-700 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    Aplicar Fator R (28%)
                  </span>
                  <span className="text-slate-600">
                    Migra do Anexo V (15,5%) para o Anexo III (6%)
                  </span>
                </div>
              </label>
            ) : (
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600">
                <strong className="text-slate-900 block">
                  Enquadramento direto no Anexo {anexoPadrao}
                </strong>
                Este código não depende da regra de 28% de folha para a menor alíquota.
              </div>
            )}
          </div>
        </div>

        <details className="pt-3 border-t border-slate-100 text-xs">
          <summary className="cursor-pointer font-semibold text-slate-700 hover:text-slate-900 select-none">
            Opções avançadas (RBT12 anual e INSS em outro vínculo)
          </summary>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label
                htmlFor="cnae-rbt12"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Receita Bruta dos últimos 12 meses — RBT12 (opcional, R$)
              </label>
              <input
                id="cnae-rbt12"
                type="number"
                min={0}
                step={10000}
                placeholder={`Automático (${formatBRL(faturamentoMensal * 12)})`}
                value={rbt12Custom}
                onChange={(e) => setRbt12Custom(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2 md:pt-4">
              <input
                type="checkbox"
                checked={inssNoTeto}
                onChange={(e) => setInssNoTeto(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-700 rounded"
              />
              <span>
                Já recolho INSS pelo teto em outro vínculo (isenta INSS de 11% sobre o pró-labore)
              </span>
            </label>
          </div>
        </details>
      </div>

      <AdSlot
        slotId="cnae-calculator-mid"
        format="in-result"
        label={`Abertura de CNPJ no CNAE ${codigoCNAE} e contabilidade no Anexo ${resultado.anexoEfetivo}`}
        estimatedCpc="CPC Médio: R$ 4,90 (Abertura de CNPJ / Contabilidade Digital)"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 border-t-4 border-t-slate-900 rounded-xl p-5">
          <span className="text-xs text-slate-500 uppercase font-semibold">
            Guia DAS (Simples Nacional)
          </span>
          <p className="text-2xl font-mono font-bold tabular-nums text-slate-900 mt-1">
            {formatBRL(resultado.valorDAS)}/mês
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Anexo {resultado.anexoEfetivo} · Alíquota efetiva:{" "}
            <strong className="font-mono text-slate-900">
              {formatPercent(resultado.aliquotaEfetivaDAS)}
            </strong>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <span className="text-xs text-slate-500 uppercase font-semibold">
            {resultado.cppPatronalAnexoIV > 0
              ? "INSS, CPP 20% e IRRF (Anexo IV)"
              : "INSS e IRRF sobre pró-labore"}
          </span>
          <p className="text-2xl font-mono font-bold tabular-nums text-slate-900 mt-1">
            {formatBRL(
              resultado.inssProLabore +
                resultado.cppPatronalAnexoIV +
                resultado.irpfProLabore
            )}
            /mês
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Pró-labore base:{" "}
            <span className="font-mono text-slate-700">
              {formatBRL(resultado.proLaboreSugerido)}
            </span>
            {resultado.cppPatronalAnexoIV > 0 &&
              ` · CPP: ${formatBRL(resultado.cppPatronalAnexoIV)}`}
          </p>
        </div>

        <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-700 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 uppercase font-semibold">
              Lucro líquido após impostos
            </span>
            <PrintButton label="PDF" />
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-emerald-700 mt-1">
            {formatBRL(resultado.lucroLiquidoIsento)}/mês
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Carga tributária total:{" "}
            <strong className="font-mono text-slate-900">
              {formatPercent(resultado.cargaTributariaTotalPercentual)}
            </strong>
          </p>
        </div>
      </div>

      {(resultado.ultrapassouTetoSimples || resultado.ultrapassouSublimiteISS) && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${
            resultado.ultrapassouTetoSimples
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          {resultado.ultrapassouTetoSimples ? (
            <>
              <strong>Alerta de teto do Simples Nacional:</strong> o RBT12 de{" "}
              <span className="font-mono font-semibold">
                {formatBRL(resultado.rbt12)}
              </span>{" "}
              supera R$ 4.800.000/ano, impedindo a permanência no Simples Nacional no próximo ano-calendário (obrigatório Lucro Presumido ou Lucro Real).
            </>
          ) : (
            <>
              <strong>Alerta de sublimite (R$ 3.600.000/ano):</strong> com RBT12 de{" "}
              <span className="font-mono font-semibold">
                {formatBRL(resultado.rbt12)}
              </span>
              , o ISS ou ICMS passa a ser recolhido fora do DAS diretamente para o município ou estado.
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-slate-700" />
            Enquadramento MEI e Fator R
          </div>
          {cabeNoMEI ? (
            <p className="text-emerald-800">
              Com faturamento anual de {formatBRL(faturamentoMensal * 12)}, esta atividade é aceita no <strong>MEI</strong>, com recolhimento fixo mensal de {formatBRL(DAS_MEI_SERVICOS_2026)} (serviços).
            </p>
          ) : permiteMEI ? (
            <p className="text-amber-800">
              Embora o CNAE conste na lista do MEI, a receita anual de {formatBRL(faturamentoMensal * 12)} excede o teto de {formatBRL(TETO_ANUAL_MEI_2026)}/ano, exigindo Microempresa (ME) no Simples Nacional.
            </p>
          ) : (
            <p className="text-slate-600">
              A atividade <strong>{tituloCNAE}</strong> é classificada como intelectual ou regulamentada e não permite inscrição como MEI, exigindo abertura de Microempresa (SLU ou LTDA).
            </p>
          )}
          {sujeitoFatorR && resultado.economiaMensalComFatorR > 0 && (
            <p className="text-emerald-800 font-medium pt-1">
              Economia com o Fator R aplicado:{" "}
              <strong className="font-mono">
                {formatBRL(resultado.economiaMensalComFatorR)}/mês
              </strong>{" "}
              (<span className="font-mono">{formatBRL(resultado.economiaMensalComFatorR * 12)}</span> ao ano) em comparação ao Anexo V.
            </p>
          )}
          {sujeitoFatorR && (
            <Link
              href="/calculadora-fator-r"
              className="no-print inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline pt-1"
            >
              Auditar pró-labore de 28% na Calculadora de Fator R
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Info className="w-4 h-4 text-slate-700" />
            Transição da Reforma Tributária (CBS e IBS)
          </div>
          <p className="text-slate-600">
            No ano-teste de 2026 do IVA Dual, empresas optantes pelo Simples Nacional mantêm o recolhimento via guia DAS sem elevação da carga efetiva.
          </p>
          <p className="text-slate-700">
            Redução setorial prevista na legislação complementar para este código:{" "}
            <strong className="text-slate-900 font-mono">
              {formatPercent(reducaoIVA2026, 0)} de redução sobre a alíquota de referência
            </strong>{" "}
            (estimativa fora do Simples: {formatPercent(resultado.reformaTributaria.aliquotaEstimadaIVADual2027)}).
          </p>
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
