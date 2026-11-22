"use client";

import React, { useState, useEffect } from "react";
import {
  AnexoSimples,
  calculateCLTvsPJ,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import PrintButton from "./PrintButton";
import { ArrowRight, Copy, Check, Share2 } from "lucide-react";
import Link from "next/link";

type OpcaoRegimePJ = "III_FATOR_R" | "III_DIRETO" | "V" | "IV" | "I";

interface Props {
  initialSalarioCLT?: number;
  initialFaturamentoPJ?: number;
  initialBeneficiosCLT?: number;
  initialAnexo?: AnexoSimples;
  initialSujeitoFatorR?: boolean;
  profissaoNome?: string;
  cnaeRecomendado?: { codigo: string; slug: string };
}

const PRESETS_CENARIOS = [
  { label: "R$ 3.500", clt: 3500, pj: 5100, ben: 650 },
  { label: "R$ 5.000", clt: 5000, pj: 7300, ben: 800 },
  { label: "R$ 8.000", clt: 8000, pj: 11600, ben: 950 },
  { label: "R$ 12.000", clt: 12000, pj: 17400, ben: 1100 },
  { label: "R$ 18.000", clt: 18000, pj: 26000, ben: 1300 },
  { label: "R$ 25.000", clt: 25000, pj: 36000, ben: 1500 },
];

function resolveRegimeInicial(
  anexo: AnexoSimples,
  sujeitoFatorR?: boolean
): OpcaoRegimePJ {
  if (anexo === "IV") return "IV";
  if (anexo === "I") return "I";
  if (sujeitoFatorR) return "III_FATOR_R";
  if (anexo === "V") return "V";
  return "III_DIRETO";
}

export default function CLTvsPJCalculator({
  initialSalarioCLT = 8000,
  initialFaturamentoPJ,
  initialBeneficiosCLT = 900,
  initialAnexo = "III",
  initialSujeitoFatorR = true,
  profissaoNome,
  cnaeRecomendado,
}: Props) {
  const [salarioCLT, setSalarioCLT] = useState<number>(initialSalarioCLT);
  const [faturamentoPJ, setFaturamentoPJ] = useState<number>(
    initialFaturamentoPJ ?? Math.round(initialSalarioCLT * 1.45)
  );
  const [beneficiosCLT, setBeneficiosCLT] = useState<number>(initialBeneficiosCLT);
  const [dependentes, setDependentes] = useState<number>(0);
  const [regimePJ, setRegimePJ] = useState<OpcaoRegimePJ>(
    resolveRegimeInicial(initialAnexo, initialSujeitoFatorR)
  );
  const [custoContabilidade, setCustoContabilidade] = useState<number>(249);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [linkCopiado, setLinkCopiado] = useState<boolean>(false);

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const clt = Number(sp.get("clt"));
      const pj = Number(sp.get("pj"));
      const ben = Number(sp.get("ben"));
      const dep = Number(sp.get("dep"));
      const contab = Number(sp.get("contab"));
      const reg = sp.get("reg");
      if (Number.isFinite(clt) && clt > 0) setSalarioCLT(clt);
      if (Number.isFinite(pj) && pj > 0) setFaturamentoPJ(pj);
      if (sp.has("ben") && Number.isFinite(ben) && ben >= 0) setBeneficiosCLT(ben);
      if (sp.has("dep") && Number.isFinite(dep) && dep >= 0) setDependentes(dep);
      if (sp.has("contab") && Number.isFinite(contab) && contab >= 0)
        setCustoContabilidade(contab);
      if (
        reg === "III_FATOR_R" ||
        reg === "III_DIRETO" ||
        reg === "V" ||
        reg === "IV" ||
        reg === "I"
      ) {
        setRegimePJ(reg);
      }
    } catch {
      // Ignora em caso de erro de leitura de URL
    }
  }, []);

  const anexoMap: Record<
    OpcaoRegimePJ,
    { anexoPJ: AnexoSimples; sujeitoFatorR: boolean; otimizarFatorR: boolean }
  > = {
    III_FATOR_R: { anexoPJ: "V", sujeitoFatorR: true, otimizarFatorR: true },
    III_DIRETO: { anexoPJ: "III", sujeitoFatorR: false, otimizarFatorR: false },
    V: { anexoPJ: "V", sujeitoFatorR: false, otimizarFatorR: false },
    IV: { anexoPJ: "IV", sujeitoFatorR: false, otimizarFatorR: false },
    I: { anexoPJ: "I", sujeitoFatorR: false, otimizarFatorR: false },
  };

  const pjParams = anexoMap[regimePJ];

  const resultado = calculateCLTvsPJ({
    salarioBrutoCLT: salarioCLT,
    faturamentoBrutoPJ: faturamentoPJ,
    beneficiosCLT,
    dependentes,
    anexoPJ: pjParams.anexoPJ,
    sujeitoFatorR: pjParams.sujeitoFatorR,
    otimizarFatorR: pjParams.otimizarFatorR,
    custoContabilidade,
  });

  const impostosCLT = resultado.clt.inss + resultado.clt.irpf;
  const indiretosCLT =
    resultado.clt.fgtsMensal +
    resultado.clt.provisao13LiquidoMensal +
    resultado.clt.provisaoFeriasLiquidoMensal +
    resultado.clt.beneficiosLiquidos;
  const totalBrutoAmpliadoCLT = Math.max(
    1,
    resultado.clt.salarioLiquidoMensal + indiretosCLT + impostosCLT
  );

  const pctLiquidoCLT =
    (resultado.clt.salarioLiquidoMensal / totalBrutoAmpliadoCLT) * 100;
  const pctIndiretosCLT = (indiretosCLT / totalBrutoAmpliadoCLT) * 100;
  const pctImpostosCLT = (impostosCLT / totalBrutoAmpliadoCLT) * 100;

  const totalBrutoPJ = Math.max(1, faturamentoPJ);
  const pctLiquidoPJ = (resultado.pj.lucroLiquidoIsento / totalBrutoPJ) * 100;
  const pctImpostosPJ =
    (resultado.pj.totalImpostosECustos / totalBrutoPJ) * 100;

  const copiarResumoSimulacao = () => {
    const texto = `Simulação CLT vs PJ 2026 (CalculaFiscal)\n- Salário CLT: ${formatBRL(
      salarioCLT
    )} (Líquido: ${formatBRL(
      resultado.clt.salarioLiquidoMensal
    )} | Pacote com FGTS, 13º e benefícios: ${formatBRL(
      resultado.clt.pacoteTotalMensalReal
    )})\n- Proposta PJ (Anexo ${resultado.pj.anexoEfetivo}): ${formatBRL(
      faturamentoPJ
    )} (Líquido isento estimado: ${formatBRL(
      resultado.pj.lucroLiquidoIsento
    )})\n- Equivalente mínimo no PJ: ${formatBRL(
      resultado.faturamentoPJEquivalente
    )}\n- Diferença mensal estimada: ${
      resultado.diferencaRealPatrimonial >= 0 ? "+" : ""
    }${formatBRL(resultado.diferencaRealPatrimonial)}/mês`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const copiarLinkSimulacao = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("clt", String(salarioCLT));
      url.searchParams.set("pj", String(faturamentoPJ));
      url.searchParams.set("ben", String(beneficiosCLT));
      url.searchParams.set("dep", String(dependentes));
      url.searchParams.set("contab", String(custoContabilidade));
      url.searchParams.set("reg", regimePJ);
      window.history.replaceState(null, "", url.pathname + url.search);
      navigator.clipboard?.writeText(url.toString());
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch {
      // Ignora
    }
  };

  return (
    <div className="space-y-6">
      {/* Referências rápidas */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-600">
            Referências rápidas de salário bruto CLT:
          </span>
          <span className="text-[11px] text-slate-400">
            Ou informe os valores exatos nos campos abaixo
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS_CENARIOS.map((preset) => {
            const ativo = salarioCLT === preset.clt;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setSalarioCLT(preset.clt);
                  setFaturamentoPJ(preset.pj);
                  setBeneficiosCLT(preset.ben);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors border ${
                  ativo
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entradas CLT e PJ */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloco CLT */}
          <div className="space-y-4 p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Regime CLT
              </span>
              {resultado.clt.isentoNovaRegra5k && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Isento de IRRF (regra até R$ 5 mil)
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="clt-salario-bruto"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Salário bruto mensal CLT (R$)
              </label>
              <input
                id="clt-salario-bruto"
                type="number"
                step={250}
                min={0}
                value={salarioCLT}
                onChange={(e) =>
                  setSalarioCLT(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:outline-none"
              />
              <input
                type="range"
                aria-label="Ajustar salário bruto mensal CLT"
                min={1621}
                max={35000}
                step={250}
                value={Math.min(35000, salarioCLT)}
                onChange={(e) => setSalarioCLT(Number(e.target.value))}
                className="no-print w-full mt-2.5 accent-blue-700 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  htmlFor="clt-beneficios"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Benefícios (VR, VA, saúde)
                </label>
                <input
                  id="clt-beneficios"
                  type="number"
                  step={100}
                  min={0}
                  value={beneficiosCLT}
                  onChange={(e) =>
                    setBeneficiosCLT(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-3 py-2 text-sm font-mono font-semibold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="clt-dependentes"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Dependentes IRPF
                </label>
                <input
                  id="clt-dependentes"
                  type="number"
                  min={0}
                  max={20}
                  value={dependentes}
                  onChange={(e) =>
                    setDependentes(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-3 py-2 text-sm font-mono font-semibold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Bloco PJ */}
          <div className="space-y-4 p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Pessoa Jurídica (CNPJ)
              </span>
              <button
                type="button"
                onClick={() =>
                  setFaturamentoPJ(Math.round(resultado.faturamentoPJEquivalente))
                }
                className="no-print text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded border border-slate-300 transition-colors"
              >
                Igualar ao equilíbrio ({formatBRL(resultado.faturamentoPJEquivalente)})
              </button>
            </div>

            <div>
              <label
                htmlFor="pj-faturamento"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Faturamento bruto mensal PJ (R$)
              </label>
              <input
                id="pj-faturamento"
                type="number"
                step={250}
                min={0}
                value={faturamentoPJ}
                onChange={(e) =>
                  setFaturamentoPJ(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full px-3.5 py-2.5 text-lg font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:outline-none"
              />
              <input
                type="range"
                aria-label="Ajustar faturamento bruto mensal PJ"
                min={2000}
                max={50000}
                step={250}
                value={Math.min(50000, faturamentoPJ)}
                onChange={(e) => setFaturamentoPJ(Number(e.target.value))}
                className="no-print w-full mt-2.5 accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  htmlFor="pj-anexo"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Anexo Simples Nacional
                </label>
                <select
                  id="pj-anexo"
                  value={regimePJ}
                  onChange={(e) => setRegimePJ(e.target.value as OpcaoRegimePJ)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="III_FATOR_R">
                    Anexo III via Fator R (6% inicial · pró-labore 28%)
                  </option>
                  <option value="III_DIRETO">
                    Anexo III direto (6% inicial · sem Fator R)
                  </option>
                  <option value="V">
                    Anexo V sem Fator R (15,5% inicial)
                  </option>
                  <option value="IV">
                    Anexo IV Advocacia/Obras (4,5% + 20% CPP)
                  </option>
                  <option value="I">Anexo I Comércio (4% inicial)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="pj-contabilidade"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Contabilidade (R$/mês)
                </label>
                <input
                  id="pj-contabilidade"
                  type="number"
                  step={50}
                  min={0}
                  value={custoContabilidade}
                  onChange={(e) =>
                    setCustoContabilidade(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-full px-3 py-2 text-sm font-mono font-semibold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot de AdSense acima do resultado */}
      <AdSlot
        slotId="clt-pj-before-result"
        format="in-result"
        label="Abertura de CNPJ, Conta Digital PJ e Contabilidade para Anexo III"
        estimatedCpc="CPC Médio: R$ 4,20 (Contabilidade Online / Conta PJ)"
      />

      {/* Resumo Comparativo Principal */}
      <div
        className={`bg-white rounded-xl p-6 border border-slate-200 border-t-4 ${
          resultado.veredito === "PJ_VANTAJOSO"
            ? "border-t-emerald-700"
            : resultado.veredito === "CLT_VANTAJOSO"
            ? "border-t-blue-700"
            : "border-t-amber-600"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                  resultado.veredito === "PJ_VANTAJOSO"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : resultado.veredito === "CLT_VANTAJOSO"
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {resultado.veredito === "PJ_VANTAJOSO"
                  ? "Resultado: PJ entrega maior retorno líquido"
                  : resultado.veredito === "CLT_VANTAJOSO"
                  ? "Resultado: CLT entrega maior patrimônio total"
                  : "Resultado: equivalência técnica"}
              </span>

              <button
                type="button"
                onClick={copiarResumoSimulacao}
                aria-live="polite"
                className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copiado ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    Resumo copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copiar resumo
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={copiarLinkSimulacao}
                aria-live="polite"
                className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {linkCopiado ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    Link copiado
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Copiar link
                  </>
                )}
              </button>

              <PrintButton />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {resultado.diferencaRealPatrimonial >= 0 ? (
                <>
                  Diferença de{" "}
                  <span className="font-mono tabular-nums text-emerald-700">
                    +{formatBRL(resultado.diferencaRealPatrimonial)}/mês
                  </span>{" "}
                  a favor do PJ
                </>
              ) : (
                <>
                  Faltam{" "}
                  <span className="font-mono tabular-nums text-blue-700">
                    {formatBRL(Math.abs(resultado.diferencaRealPatrimonial))}/mês
                  </span>{" "}
                  no PJ para empatar com o pacote CLT
                </>
              )}
            </h3>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              O salário bruto de{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(salarioCLT)}
              </strong>{" "}
              na CLT resulta em{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(resultado.clt.salarioLiquidoMensal)}
              </strong>{" "}
              líquidos por mês, mas soma{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(resultado.clt.pacoteTotalMensalReal)}/mês
              </strong>{" "}
              quando incluídos FGTS, 13º, férias e benefícios. Para empatar nesse patamar no regime{" "}
              <strong>Anexo {resultado.pj.anexoEfetivo}</strong>, o faturamento mínimo estimado é de{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(resultado.faturamentoPJEquivalente)}
              </strong>{" "}
              (<span className="font-mono">{resultado.multiplicadorIdeal}x</span> o bruto CLT).
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-5 min-w-[250px] border border-slate-200 shrink-0">
            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
              Saldo acumulado em 12 meses
            </p>
            <p
              className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums mt-1 ${
                resultado.diferencaRealPatrimonial >= 0
                  ? "text-emerald-700"
                  : "text-blue-700"
              }`}
            >
              {resultado.diferencaRealPatrimonial >= 0 ? "+" : ""}
              {formatBRL(resultado.diferencaRealPatrimonial * 12)}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-between text-xs text-slate-600">
              <span>Saldo mensal em conta:</span>
              <strong className="font-mono tabular-nums text-slate-900">
                {resultado.diferencaNoBolsoMensal >= 0 ? "+" : ""}
                {formatBRL(resultado.diferencaNoBolsoMensal)}
              </strong>
            </div>
          </div>
        </div>

        {cnaeRecomendado && (
          <div className="no-print mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              CNAE usual para {profissaoNome || "esta atividade"}:{" "}
              <strong className="font-mono text-slate-900">
                {cnaeRecomendado.codigo}
              </strong>
            </span>
            <Link
              href={`/cnae/${cnaeRecomendado.slug}`}
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
            >
              Simular guia DAS deste CNAE
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Distribuição proporcional da remuneração */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold text-sm sm:text-base text-slate-900">
            Composição da remuneração e descontos
          </h4>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
              Líquido mensal
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
              FGTS, 13º, férias e benefícios
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 inline-block" />
              Impostos e custos
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>
                CLT (Pacote{" "}
                <strong className="font-mono text-slate-900">
                  {formatBRL(resultado.clt.pacoteTotalMensalReal)}
                </strong>
                )
              </span>
              <span className="font-mono text-rose-700">
                INSS + IRRF: {formatBRL(impostosCLT)} ({pctImpostosCLT.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-4 rounded bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${pctLiquidoCLT}%` }}
                className="bg-emerald-600 h-full transition-all duration-300"
                title={`Salário Líquido: ${formatBRL(resultado.clt.salarioLiquidoMensal)}`}
              />
              <div
                style={{ width: `${pctIndiretosCLT}%` }}
                className="bg-blue-600 h-full transition-all duration-300"
                title={`FGTS + 13º + Férias + Benefícios: ${formatBRL(indiretosCLT)}`}
              />
              <div
                style={{ width: `${pctImpostosCLT}%` }}
                className="bg-rose-600 h-full transition-all duration-300"
                title={`INSS + IRPF: ${formatBRL(impostosCLT)}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>
                PJ (Líquido{" "}
                <strong className="font-mono text-emerald-700">
                  {formatBRL(resultado.pj.lucroLiquidoIsento)}
                </strong>{" "}
                · {pctLiquidoPJ.toFixed(1)}% do faturamento)
              </span>
              <span className="font-mono text-rose-700">
                Impostos e contabilidade: {formatBRL(resultado.pj.totalImpostosECustos)} (
                {pctImpostosPJ.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-4 rounded bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${pctLiquidoPJ}%` }}
                className="bg-emerald-600 h-full transition-all duration-300"
                title={`Lucro Líquido PJ: ${formatBRL(resultado.pj.lucroLiquidoIsento)}`}
              />
              <div
                style={{ width: `${pctImpostosPJ}%` }}
                className="bg-rose-600 h-full transition-all duration-300"
                title={`Impostos PJ + Contador: ${formatBRL(resultado.pj.totalImpostosECustos)}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabelas Analíticas Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
            <span>Detalhamento CLT</span>
            <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              Bruto: {formatBRL(salarioCLT)}
            </span>
          </h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">INSS progressivo</dt>
              <dd className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(resultado.clt.inss)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">IRRF ({resultado.clt.metodoIR})</dt>
              <dd className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(resultado.clt.irpf)}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
              <dt>Salário líquido mensal</dt>
              <dd className="font-mono tabular-nums text-blue-700">
                {formatBRL(resultado.clt.salarioLiquidoMensal)}
              </dd>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Benefícios e provisões mensais
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">FGTS mensal (8%)</dt>
              <dd className="font-mono font-medium tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.fgtsMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">13º proporcional (1/12)</dt>
              <dd className="font-mono font-medium tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.provisao13LiquidoMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">Adicional 1/3 de férias</dt>
              <dd className="font-mono font-medium tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.provisaoFeriasLiquidoMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">Vale-refeição e plano de saúde</dt>
              <dd className="font-mono font-medium tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.beneficiosLiquidos)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-base text-slate-900">
              <dt>Pacote mensal equivalente</dt>
              <dd className="font-mono tabular-nums text-blue-700">
                {formatBRL(resultado.clt.pacoteTotalMensalReal)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
            <span>Detalhamento Simples Nacional</span>
            <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              NF: {formatBRL(faturamentoPJ)}
            </span>
          </h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">
                Guia DAS (Anexo {resultado.pj.anexoEfetivo} ·{" "}
                <strong className="font-mono">
                  {formatPercent(resultado.pj.aliquotaEfetivaDAS)}
                </strong>
                )
              </dt>
              <dd className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(resultado.pj.valorDAS)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">
                INSS sobre pró-labore ({formatBRL(resultado.pj.proLaboreSugerido)})
              </dt>
              <dd className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(resultado.pj.inssProLabore)}
              </dd>
            </div>
            {resultado.pj.cppPatronalAnexoIV > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-600">
                  CPP Patronal Anexo IV (20% s/ pró-labore)
                </dt>
                <dd className="font-mono font-medium tabular-nums text-rose-700">
                  - {formatBRL(resultado.pj.cppPatronalAnexoIV)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-600">IRRF sobre pró-labore</dt>
              <dd className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(resultado.pj.irpfProLabore)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Contabilidade mensal</dt>
              <dd className="font-mono font-medium tabular-nums text-rose-700">
                - {formatBRL(resultado.pj.custoContabilidade)}
              </dd>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Indicadores fiscais (2026)
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">Carga tributária efetiva no CNPJ</dt>
              <dd className="font-mono font-semibold tabular-nums text-slate-800">
                {formatPercent(resultado.pj.cargaTributariaTotalPercentual)}
              </dd>
            </div>
            {resultado.pj.enquadrouFatorR && (
              <div className="flex justify-between text-xs">
                <dt className="text-slate-600">
                  Economia mensal com Fator R (28%)
                </dt>
                <dd className="font-mono font-semibold tabular-nums text-emerald-700">
                  + {formatBRL(resultado.pj.economiaMensalComFatorR)}/mês
                </dd>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">
                Destaque teste CBS/IBS (0,9% + 0,1%)
              </dt>
              <dd className="font-mono font-medium tabular-nums text-slate-600">
                {formatBRL(resultado.pj.reformaTributaria.valorDestaqueNota2026)} (compensável)
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-base text-slate-900">
              <dt>Resultado líquido disponível (PJ)</dt>
              <dd className="font-mono tabular-nums text-emerald-700">
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
