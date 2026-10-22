"use client";

import React, { useState } from "react";
import {
  AnexoSimples,
  calculateSimplesNacional2026,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import { CheckCircle2, Sparkles, ShieldAlert } from "lucide-react";

interface CNAECalculatorProps {
  codigoCNAE: string;
  tituloCNAE: string;
  anexoPadrao: AnexoSimples;
  sujeitoFatorR: boolean;
  permiteMEI: boolean;
  reducaoIVA2026: number;
}

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

  const resultado = calculateSimplesNacional2026({
    faturamentoMensal,
    anexo: anexoPadrao,
    sujeitoFatorR,
    otimizarFatorR,
    reducaoSetorialIVA: reducaoIVA2026,
  });

  const cabeNoMEI = permiteMEI && faturamentoMensal * 12 <= 81000;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800">
            Simulador Oficial Simples Nacional + Reforma 2026 • CNAE {codigoCNAE}
          </span>
          {sujeitoFatorR && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
               elegível ao Fator R (Redução para 6% no Anexo III)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Quanto você planeja faturar por mês neste CNAE? (R$)
            </label>
            <input
              type="number"
              step={500}
              min={1000}
              value={faturamentoMensal}
              onChange={(e) => setFaturamentoMensal(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xl font-extrabold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <input
              type="range"
              min={2000}
              max={60000}
              step={500}
              value={Math.min(60000, faturamentoMensal)}
              onChange={(e) => setFaturamentoMensal(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            {sujeitoFatorR ? (
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={otimizarFatorR}
                  onChange={(e) => setOtimizarFatorR(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-emerald-950 block">
                    Ativar Fator R (28%)
                  </span>
                  <span className="text-emerald-700">
                    Cai do Anexo V (15,5%) para Anexo III (6%)
                  </span>
                </div>
              </label>
            ) : (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600">
                <strong className="text-slate-900 block">
                  Tributação Direta no Anexo {anexoPadrao}
                </strong>
                Não exige folha de 28% (Fator R) para manter a menor alíquota!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot AdSense de Alta Intenção B2B */}
      <AdSlot
        slotId="cnae-calculator-mid"
        format="in-result"
        label={`Abra seu CNPJ com o CNAE ${codigoCNAE} sem pagar taxa de abertura e enquadrado no Anexo ${resultado.anexoEfetivo}`}
        estimatedCpc="CPC Médio: R$ 4,90 (Abertura de CNPJ / Contabilidade Digital)"
      />

      {/* Resultados do Cálculo do CNAE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow">
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Guia DAS (Simples Nacional)
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {formatBRL(resultado.valorDAS)}/mês
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Anexo {resultado.anexoEfetivo} • Alíquota Efetiva:{" "}
            <strong>{formatPercent(resultado.aliquotaEfetivaDAS)}</strong>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 uppercase font-semibold">
            Pró-Labore + INSS + IRPF (2026)
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatBRL(resultado.inssProLabore + resultado.irpfProLabore)}/mês
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Sobre pró-labore de {formatBRL(resultado.proLaboreSugerido)}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-emerald-800 uppercase font-bold">
            Lucro Líquido Livre (Isento de IR)
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {formatBRL(resultado.lucroLiquidoIsento)}/mês
          </p>
          <p className="text-xs text-emerald-800 mt-1">
            Carga total: {formatPercent(resultado.cargaTributariaTotalPercentual)}
          </p>
        </div>
      </div>

      {/* Alertas Inteligentes (MEI, Fator R e Reforma Tributária 2026) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            {sujeitoFatorR ? (
              <Sparkles className="w-4 h-4 text-emerald-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            )}
            Diagnóstico Fator R e MEI (2026)
          </div>
          {cabeNoMEI ? (
            <p className="text-emerald-700 font-medium">
              ✅ Com faturamento anual de {formatBRL(faturamentoMensal * 12)}, este CNAE permite ser <strong>MEI</strong> pagando apenas a guia fixa mensal (~R$ 86/mês)!
            </p>
          ) : permiteMEI ? (
            <p className="text-amber-700">
              ⚠️ Este CNAE aceita MEI, mas seu faturamento anual ({formatBRL(faturamentoMensal * 12)}) ultrapassa o teto de R$ 81.000/ano, exigindo Microempresa (ME) no Simples Nacional.
            </p>
          ) : (
            <p className="text-slate-600">
              ℹ️ A atividade <strong>{tituloCNAE}</strong> é considerada intelectual/regulamentada e não pode ser MEI, devendo abrir como Microempresa (SLU/LTDA) no Simples Nacional.
            </p>
          )}
          {sujeitoFatorR && resultado.economiaMensalComFatorR > 0 && (
            <p className="text-emerald-700 font-semibold pt-1">
              💰 Economia com Fator R ativado: você economiza{" "}
              <strong>{formatBRL(resultado.economiaMensalComFatorR)}/mês</strong> ({formatBRL(resultado.economiaMensalComFatorR * 12)}/ano) em relação ao Anexo V!
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            Impacto da Reforma Tributária (CBS e IBS 2026)
          </div>
          <p className="text-slate-600">
            Em 2026 (ano-teste do IVA Dual), empresas no Simples Nacional continuam recolhendo via guia única (DAS), sem aumento de carga.
          </p>
          <p className="text-slate-700 font-medium">
            • Redução setorial aprovada na Lei Complementar para este CNAE:{" "}
            <strong className="text-blue-700">
              {formatPercent(reducaoIVA2026, 0)} de desconto na alíquota padrão do IVA
            </strong>{" "}
            (Alíquota estimada fora do Simples: {formatPercent(resultado.reformaTributaria.aliquotaEstimadaIVADual2027)}).
          </p>
        </div>
      </div>
    </div>
  );
}
