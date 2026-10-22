"use client";

import React, { useState } from "react";
import {
  AnexoSimples,
  calculateCLTvsPJ,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import { CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  initialSalarioCLT?: number;
  initialFaturamentoPJ?: number;
  initialBeneficiosCLT?: number;
  initialAnexo?: AnexoSimples;
  profissaoNome?: string;
  cnaeRecomendado?: { codigo: string; slug: string };
}

export default function CLTvsPJCalculator({
  initialSalarioCLT = 8000,
  initialFaturamentoPJ,
  initialBeneficiosCLT = 900,
  initialAnexo = "III",
  profissaoNome,
  cnaeRecomendado,
}: Props) {
  const [salarioCLT, setSalarioCLT] = useState<number>(initialSalarioCLT);
  const [faturamentoPJ, setFaturamentoPJ] = useState<number>(
    initialFaturamentoPJ ?? Math.round(initialSalarioCLT * 1.4)
  );
  const [beneficiosCLT, setBeneficiosCLT] = useState<number>(initialBeneficiosCLT);
  const [dependentes, setDependentes] = useState<number>(0);
  const [anexoPJ, setAnexoPJ] = useState<AnexoSimples>(initialAnexo);
  const [custoContabilidade, setCustoContabilidade] = useState<number>(249);

  const resultado = calculateCLTvsPJ({
    salarioBrutoCLT: salarioCLT,
    faturamentoBrutoPJ: faturamentoPJ,
    beneficiosCLT,
    dependentes,
    anexoPJ,
    sujeitoFatorR: true,
    custoContabilidade,
  });

  return (
    <div className="space-y-8">
      {/* Painel de Entradas Interativas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lado CLT */}
          <div className="space-y-4 p-5 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                Proposta ou Salário CLT
              </span>
              {resultado.clt.isentoNovaRegra5k && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Isento de IRPF (Regra 2026 ≤ R$ 5k)
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Salário Bruto Mensal CLT (R$)
              </label>
              <input
                type="number"
                step={250}
                min={1621}
                value={salarioCLT}
                onChange={(e) => setSalarioCLT(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <input
                type="range"
                min={2000}
                max={35000}
                step={500}
                value={Math.min(35000, salarioCLT)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSalarioCLT(val);
                }}
                className="w-full mt-2 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Benefícios Mensais (VR/VA + Saúde)
                </label>
                <input
                  type="number"
                  step={100}
                  min={0}
                  value={beneficiosCLT}
                  onChange={(e) => setBeneficiosCLT(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dependentes IRPF
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={dependentes}
                  onChange={(e) => setDependentes(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Lado PJ */}
          <div className="space-y-4 p-5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                Proposta ou Faturamento PJ (CNPJ)
              </span>
              <button
                type="button"
                onClick={() =>
                  setFaturamentoPJ(Math.round(resultado.faturamentoPJEquivalente))
                }
                className="text-[11px] font-semibold text-blue-700 hover:underline"
              >
                Usar Ponto de Equilíbrio ({formatBRL(resultado.faturamentoPJEquivalente)})
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Faturamento Bruto Mensal PJ (Nota Fiscal R$)
              </label>
              <input
                type="number"
                step={250}
                min={1621}
                value={faturamentoPJ}
                onChange={(e) => setFaturamentoPJ(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <input
                type="range"
                min={2000}
                max={50000}
                step={500}
                value={Math.min(50000, faturamentoPJ)}
                onChange={(e) => setFaturamentoPJ(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enquadramento Simples
                </label>
                <select
                  value={anexoPJ}
                  onChange={(e) => setAnexoPJ(e.target.value as AnexoSimples)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="III">Anexo III (6% inicial / Fator R)</option>
                  <option value="IV">Anexo IV (4,5% Advocacia/Eng)</option>
                  <option value="V">Anexo V sem Fator R (15,5%)</option>
                  <option value="I">Anexo I Comércio (4%)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contabilidade Online (R$/mês)
                </label>
                <input
                  type="number"
                  step={50}
                  min={0}
                  value={custoContabilidade}
                  onChange={(e) =>
                    setCustoContabilidade(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot de AdSense #1: Posicionado exatamente acima do Veredito (CTR Altíssimo) */}
      <AdSlot
        slotId="clt-pj-before-result"
        format="in-result"
        label="Anúncio Patrocinado • Abra seu CNPJ Gratuitamente com Contabilidade Digital Especializada em Fator R"
        estimatedCpc="CPC Médio: R$ 4,20 (Contabilidade Online / Conta PJ)"
      />

      {/* Card de Veredito Final e Ponto de Equilíbrio */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border-2 shadow-md ${
          resultado.veredito === "PJ_VANTAJOSO"
            ? "bg-emerald-950 text-white border-emerald-500"
            : resultado.veredito === "CLT_VANTAJOSO"
            ? "bg-blue-950 text-white border-blue-500"
            : "bg-slate-900 text-white border-amber-400"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10">
              {resultado.veredito === "PJ_VANTAJOSO" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Veredito 2026: Proposta PJ é mais vantajosa!
                </>
              ) : resultado.veredito === "CLT_VANTAJOSO" ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Veredito 2026: CLT ainda entrega maior patrimônio total
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-blue-300" />
                  Veredito 2026: Empate Técnico entre CLT e PJ
                </>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold">
              {resultado.diferencaRealPatrimonial >= 0 ? (
                <>
                  O PJ rende{" "}
                  <span className="text-emerald-400">
                    +{formatBRL(resultado.diferencaRealPatrimonial)}/mês
                  </span>{" "}
                  acima de todo o pacote CLT
                </>
              ) : (
                <>
                  Faltam{" "}
                  <span className="text-amber-400">
                    {formatBRL(Math.abs(resultado.diferencaRealPatrimonial))}/mês
                  </span>{" "}
                  no PJ para empatar com os benefícios da CLT
                </>
              )}
            </h3>

            <p className="text-sm text-slate-300 max-w-2xl">
              Para um salário CLT de <strong>{formatBRL(salarioCLT)}</strong> (que gera{" "}
              <strong>{formatBRL(resultado.clt.salarioLiquidoMensal)}</strong> líquidos na conta + FGTS, 13º, férias e benefícios somando{" "}
              <strong>{formatBRL(resultado.clt.pacoteTotalMensalReal)}/mês</strong>), o{" "}
              <strong className="text-amber-300">
                Salário PJ Mínimo Ideal (Ponto de Equilíbrio) é de{" "}
                {formatBRL(resultado.faturamentoPJEquivalente)}
              </strong>{" "}
              ({resultado.multiplicadorIdeal}x o bruto CLT).
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 min-w-[240px] border border-white/15 shrink-0">
            <p className="text-xs text-slate-300 uppercase font-semibold">
              Diferença Anual (12 meses)
            </p>
            <p
              className={`text-2xl font-black mt-1 ${
                resultado.diferencaRealPatrimonial >= 0
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {resultado.diferencaRealPatrimonial >= 0 ? "+" : ""}
              {formatBRL(resultado.diferencaRealPatrimonial * 12)}/ano
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              No bolso todo mês:{" "}
              <strong>
                {resultado.diferencaNoBolsoMensal >= 0 ? "+" : ""}
                {formatBRL(resultado.diferencaNoBolsoMensal)}
              </strong>
            </p>
          </div>
        </div>

        {cnaeRecomendado && (
          <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span>
              💡 CNAE recomendado para {profissaoNome || "esta atividade"}:{" "}
              <strong>{cnaeRecomendado.codigo}</strong>
            </span>
            <Link
              href={`/cnae/${cnaeRecomendado.slug}`}
              className="inline-flex items-center gap-1 font-bold text-emerald-300 hover:underline"
            >
              Ver tabela de impostos deste CNAE
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Tabela Comparativa Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detalhamento CLT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <span>Raio-X na CLT (2026)</span>
            <span className="text-sm font-semibold text-blue-600">
              Bruto: {formatBRL(salarioCLT)}
            </span>
          </h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">(-) Desconto INSS Progressivo</dt>
              <dd className="font-semibold text-rose-600">
                - {formatBRL(resultado.clt.inss)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">
                (-) Imposto de Renda (IRRF 2026 • {resultado.clt.metodoIR})
              </dt>
              <dd className="font-semibold text-rose-600">
                - {formatBRL(resultado.clt.irpf)}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-base text-slate-900">
              <dt>= Salário Líquido na Conta (Mensal)</dt>
              <dd className="text-blue-700">
                {formatBRL(resultado.clt.salarioLiquidoMensal)}
              </dd>
            </div>
            <div className="pt-3 mt-3 border-t border-dashed border-slate-200 text-xs font-semibold uppercase text-slate-400">
              Benefícios Indiretos e Patrimônio Anual (Média Mensal)
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) Depósito FGTS (8% ao mês)</dt>
              <dd className="font-semibold text-emerald-700">
                + {formatBRL(resultado.clt.fgtsMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) 13º Salário Líquido Proporcional (1/12)</dt>
              <dd className="font-semibold text-emerald-700">
                + {formatBRL(resultado.clt.provisao13LiquidoMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) Terço de Férias Líquido Proporcional</dt>
              <dd className="font-semibold text-emerald-700">
                + {formatBRL(resultado.clt.provisaoFeriasLiquidoMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) Vale-Refeição / Plano de Saúde</dt>
              <dd className="font-semibold text-emerald-700">
                + {formatBRL(resultado.clt.beneficiosLiquidos)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-200 font-extrabold text-base text-slate-900">
              <dt>Pacote Total Real CLT (Mensal)</dt>
              <dd className="text-blue-700">
                {formatBRL(resultado.clt.pacoteTotalMensalReal)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Detalhamento PJ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <span>Raio-X no PJ • Simples Nacional</span>
            <span className="text-sm font-semibold text-emerald-700">
              NF: {formatBRL(faturamentoPJ)}
            </span>
          </h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">
                (-) Guia DAS Simples (Anexo {resultado.pj.anexoEfetivo} •{" "}
                {formatPercent(resultado.pj.aliquotaEfetivaDAS)})
              </dt>
              <dd className="font-semibold text-rose-600">
                - {formatBRL(resultado.pj.valorDAS)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">
                (-) INSS sobre Pró-Labore ({formatBRL(resultado.pj.proLaboreSugerido)})
              </dt>
              <dd className="font-semibold text-rose-600">
                - {formatBRL(resultado.pj.inssProLabore)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">(-) IRRF sobre Pró-Labore (Tabela 2026)</dt>
              <dd className="font-semibold text-rose-600">
                - {formatBRL(resultado.pj.irpfProLabore)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">(-) Mensalidade Contabilidade Digital</dt>
              <dd className="font-semibold text-rose-600">
                - {formatBRL(resultado.pj.custoContabilidade)}
              </dd>
            </div>
            <div className="pt-3 mt-3 border-t border-dashed border-slate-200 text-xs font-semibold uppercase text-slate-400">
              Indicadores Fiscais & Reforma Tributária 2026
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">Carga Tributária Efetiva Total no CNPJ</dt>
              <dd className="font-bold text-slate-800">
                {formatPercent(resultado.pj.cargaTributariaTotalPercentual)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">
                Economia obtida usando Fator R (28%)
              </dt>
              <dd className="font-bold text-emerald-700">
                + {formatBRL(resultado.pj.economiaMensalComFatorR)}/mês
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">
                Destaque Reforma Tributária 2026 (CBS 0,9% + IBS 0,1%)
              </dt>
              <dd className="font-medium text-slate-600">
                {formatBRL(resultado.pj.reformaTributaria.valorDestaqueNota2026)} (Compensável no DAS)
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-200 font-extrabold text-base text-slate-900">
              <dt>Lucro Líquido Livre no Bolso (PJ)</dt>
              <dd className="text-emerald-700">
                {formatBRL(resultado.pj.lucroLiquidoIsento)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
