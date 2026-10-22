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
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Copy,
  Check,
  BarChart3,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialSalarioCLT?: number;
  initialFaturamentoPJ?: number;
  initialBeneficiosCLT?: number;
  initialAnexo?: AnexoSimples;
  profissaoNome?: string;
  cnaeRecomendado?: { codigo: string; slug: string };
}

const PRESETS_CENARIOS = [
  { label: "Júnior / Técnico", clt: 3500, pj: 5200, ben: 650 },
  { label: "Faixa Isenção IR 2026", clt: 5000, pj: 7300, ben: 800 },
  { label: "Pleno / Especialista", clt: 8500, pj: 12500, ben: 1000 },
  { label: "Sênior / Engenheiro", clt: 14000, pj: 20500, ben: 1300 },
  { label: "Médico / Executivo", clt: 22000, pj: 32000, ben: 1500 },
];

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
    initialFaturamentoPJ ?? Math.round(initialSalarioCLT * 1.45)
  );
  const [beneficiosCLT, setBeneficiosCLT] = useState<number>(initialBeneficiosCLT);
  const [dependentes, setDependentes] = useState<number>(0);
  const [anexoPJ, setAnexoPJ] = useState<AnexoSimples>(initialAnexo);
  const [custoContabilidade, setCustoContabilidade] = useState<number>(249);
  const [copiado, setCopiado] = useState<boolean>(false);

  const resultado = calculateCLTvsPJ({
    salarioBrutoCLT: salarioCLT,
    faturamentoBrutoPJ: faturamentoPJ,
    beneficiosCLT,
    dependentes,
    anexoPJ,
    sujeitoFatorR: true,
    custoContabilidade,
  });

  // Proporções visuais para o Gráfico Comparativo de Barras (Termômetro Patrimonial)
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
    const texto = `📊 *Simulação CLT vs PJ 2026 (CalculaFiscal)*\n• Salário CLT: ${formatBRL(
      salarioCLT
    )} (Líquido: ${formatBRL(
      resultado.clt.salarioLiquidoMensal
    )} | Pacote Total c/ FGTS+13º+Benefícios: ${formatBRL(
      resultado.clt.pacoteTotalMensalReal
    )})\n• Proposta PJ: ${formatBRL(faturamentoPJ)} (Lucro Líquido Livre: ${formatBRL(
      resultado.pj.lucroLiquidoIsento
    )})\n• Mínimo Ideal PJ p/ Empatar: ${formatBRL(
      resultado.faturamentoPJEquivalente
    )}\n• Diferença Real no Bolso: ${
      resultado.diferencaRealPatrimonial >= 0 ? "+" : ""
    }${formatBRL(resultado.diferencaRealPatrimonial)}/mês`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-7">
      {/* Barra de Cenários Rápidos 1-Toque (Micro-interação Fintech) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Simulação Rápida por Perfil Salarial (1 Toque):
          </span>
          <span className="text-[11px] text-slate-400">
            Clique para preencher ou digite abaixo
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
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
                  ativo
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm -translate-y-0.5"
                    : "bg-slate-50 hover:bg-blue-50/70 text-slate-700 border-slate-200 hover:border-blue-300"
                }`}
              >
                <span>{preset.label}</span>
                <span
                  className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                    ativo
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  R$ {preset.clt.toLocaleString("pt-BR")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Painel de Entradas Interativas */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lado CLT */}
          <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-b from-blue-50/70 to-slate-50/40 border border-blue-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100/90 px-2.5 py-1 rounded-lg">
                1. Carteira Assinada (CLT)
              </span>
              {resultado.clt.isentoNovaRegra5k && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ✨ Isento de IRPF (Regra 2026 ≤ R$ 5k)
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Salário Bruto Mensal CLT (R$)
              </label>
              <input
                type="number"
                step={250}
                min={1621}
                value={salarioCLT}
                onChange={(e) => setSalarioCLT(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xl font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-inner"
              />
              <input
                type="range"
                min={1621}
                max={35000}
                step={250}
                value={Math.min(35000, salarioCLT)}
                onChange={(e) => setSalarioCLT(Number(e.target.value))}
                className="w-full mt-3 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Benefícios (VR/VA + Saúde)
                </label>
                <input
                  type="number"
                  step={100}
                  min={0}
                  value={beneficiosCLT}
                  onChange={(e) => setBeneficiosCLT(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono font-semibold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg"
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
                  className="w-full px-3 py-2 text-sm font-mono font-semibold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Lado PJ */}
          <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-slate-50/40 border border-emerald-200/70">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-lg">
                2. Pessoa Jurídica (CNPJ)
              </span>
              <button
                type="button"
                onClick={() =>
                  setFaturamentoPJ(Math.round(resultado.faturamentoPJEquivalente))
                }
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm transition-colors"
              >
                Igualar ao Ponto de Equilíbrio ({formatBRL(resultado.faturamentoPJEquivalente)})
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Faturamento Bruto Mensal PJ (Nota Fiscal R$)
              </label>
              <input
                type="number"
                step={250}
                min={1621}
                value={faturamentoPJ}
                onChange={(e) => setFaturamentoPJ(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xl font-mono font-bold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-inner"
              />
              <input
                type="range"
                min={2000}
                max={50000}
                step={250}
                value={Math.min(50000, faturamentoPJ)}
                onChange={(e) => setFaturamentoPJ(Number(e.target.value))}
                className="w-full mt-3 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Anexo Simples Nacional
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
                  Contador Online (R$/mês)
                </label>
                <input
                  type="number"
                  step={50}
                  min={0}
                  value={custoContabilidade}
                  onChange={(e) =>
                    setCustoContabilidade(Number(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 text-sm font-mono font-semibold tabular-nums text-slate-900 bg-white border border-slate-300 rounded-lg"
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

      {/* Card de Veredito Final e Ponto de Equilíbrio (Swiss Fintech Dark Terminal) */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border-2 shadow-xl bg-fintech-grid transition-colors ${
          resultado.veredito === "PJ_VANTAJOSO"
            ? "bg-slate-950 text-white border-emerald-500/80"
            : resultado.veredito === "CLT_VANTAJOSO"
            ? "bg-slate-950 text-white border-blue-500/80"
            : "bg-slate-900 text-white border-amber-400/80"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/15">
                {resultado.veredito === "PJ_VANTAJOSO" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Veredito 2026: Proposta PJ é mais vantajosa!
                  </>
                ) : resultado.veredito === "CLT_VANTAJOSO" ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Veredito 2026: CLT entrega maior patrimônio total
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-blue-300" />
                    Veredito 2026: Empate Técnico entre CLT e PJ
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={copiarResumoSimulacao}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-colors"
              >
                {copiado ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Resumo Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Resumo p/ WhatsApp
                  </>
                )}
              </button>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {resultado.diferencaRealPatrimonial >= 0 ? (
                <>
                  O PJ gera{" "}
                  <span className="font-mono tabular-nums text-emerald-400">
                    +{formatBRL(resultado.diferencaRealPatrimonial)}/mês
                  </span>{" "}
                  acima de todo o pacote CLT
                </>
              ) : (
                <>
                  Faltam{" "}
                  <span className="font-mono tabular-nums text-amber-400">
                    {formatBRL(Math.abs(resultado.diferencaRealPatrimonial))}/mês
                  </span>{" "}
                  no PJ para empatar com os direitos da CLT
                </>
              )}
            </h3>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Um salário CLT de{" "}
              <strong className="font-mono text-white">
                {formatBRL(salarioCLT)}
              </strong>{" "}
              deixa{" "}
              <strong className="font-mono text-white">
                {formatBRL(resultado.clt.salarioLiquidoMensal)}
              </strong>{" "}
              líquidos na conta, mas vale{" "}
              <strong className="font-mono text-white">
                {formatBRL(resultado.clt.pacoteTotalMensalReal)}/mês
              </strong>{" "}
              somando FGTS, 13º, férias e benefícios. Por isso, o{" "}
              <strong className="text-amber-300 font-mono">
                Ponto de Equilíbrio PJ é {formatBRL(resultado.faturamentoPJEquivalente)}
              </strong>{" "}
              (<span className="font-mono">{resultado.multiplicadorIdeal}x</span> o bruto CLT).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 min-w-[260px] border border-white/15 shrink-0">
            <p className="text-[11px] text-slate-300 uppercase font-bold tracking-wider">
              Ganho / Perda Acumulada em 1 Ano
            </p>
            <p
              className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums mt-1 ${
                resultado.diferencaRealPatrimonial >= 0
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {resultado.diferencaRealPatrimonial >= 0 ? "+" : ""}
              {formatBRL(resultado.diferencaRealPatrimonial * 12)}
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-xs text-slate-300">
              <span>Dinheiro livre/mês:</span>
              <strong className="font-mono tabular-nums text-white">
                {resultado.diferencaNoBolsoMensal >= 0 ? "+" : ""}
                {formatBRL(resultado.diferencaNoBolsoMensal)}
              </strong>
            </div>
          </div>
        </div>

        {cnaeRecomendado && (
          <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span>
              💡 CNAE recomendado para {profissaoNome || "esta atividade"}:{" "}
              <strong className="font-mono text-emerald-300">
                {cnaeRecomendado.codigo}
              </strong>
            </span>
            <Link
              href={`/cnae/${cnaeRecomendado.slug}`}
              className="inline-flex items-center gap-1 font-bold text-emerald-300 hover:underline"
            >
              Abrir calculadora exclusiva deste CNAE
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Termômetro Visual de Retenção Líquida vs Impostos (Data Visualization Fintech) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-extrabold text-base text-slate-900">
              Termômetro Visual: Para onde vai o seu dinheiro em cada regime?
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              Líquido na Conta
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
              FGTS + 13º + Férias + VR
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
              Impostos & Descontos
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Barra CLT */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>
                Composição CLT (Pacote Total:{" "}
                <strong className="font-mono">
                  {formatBRL(resultado.clt.pacoteTotalMensalReal)}
                </strong>
                )
              </span>
              <span className="font-mono text-rose-600">
                Impostos: {formatBRL(impostosCLT)} ({pctImpostosCLT.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-5 rounded-xl bg-slate-100 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${pctLiquidoCLT}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Salário Líquido: ${formatBRL(resultado.clt.salarioLiquidoMensal)}`}
              />
              <div
                style={{ width: `${pctIndiretosCLT}%` }}
                className="bg-blue-500 h-full transition-all duration-300"
                title={`FGTS + 13º + Férias + Benefícios: ${formatBRL(indiretosCLT)}`}
              />
              <div
                style={{ width: `${pctImpostosCLT}%` }}
                className="bg-rose-500 h-full transition-all duration-300"
                title={`INSS + IRPF: ${formatBRL(impostosCLT)}`}
              />
            </div>
          </div>

          {/* Barra PJ */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>
                Composição PJ (Líquido no Bolso:{" "}
                <strong className="font-mono text-emerald-700">
                  {formatBRL(resultado.pj.lucroLiquidoIsento)}
                </strong>{" "}
                • {pctLiquidoPJ.toFixed(1)}% da Nota)
              </span>
              <span className="font-mono text-rose-600">
                DAS + INSS + Contador: {formatBRL(resultado.pj.totalImpostosECustos)} (
                {pctImpostosPJ.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-5 rounded-xl bg-slate-100 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${pctLiquidoPJ}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Lucro Líquido PJ: ${formatBRL(resultado.pj.lucroLiquidoIsento)}`}
              />
              <div
                style={{ width: `${pctImpostosPJ}%` }}
                className="bg-rose-500 h-full transition-all duration-300"
                title={`Impostos PJ + Contador: ${formatBRL(resultado.pj.totalImpostosECustos)}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detalhamento CLT */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <h4 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <span>Raio-X na CLT (2026)</span>
            <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              Bruto: {formatBRL(salarioCLT)}
            </span>
          </h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">(-) Desconto INSS Progressivo</dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(resultado.clt.inss)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">
                (-) Imposto de Renda (IRRF 2026 • {resultado.clt.metodoIR})
              </dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(resultado.clt.irpf)}
              </dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-base text-slate-900">
              <dt>= Salário Líquido na Conta (Mensal)</dt>
              <dd className="font-mono tabular-nums text-blue-700">
                {formatBRL(resultado.clt.salarioLiquidoMensal)}
              </dd>
            </div>
            <div className="pt-3 mt-3 border-t border-dashed border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Benefícios Indiretos e Patrimônio Anual (Média Mensal)
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) Depósito FGTS (8% ao mês)</dt>
              <dd className="font-mono font-semibold tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.fgtsMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) 13º Salário Líquido Proporcional (1/12)</dt>
              <dd className="font-mono font-semibold tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.provisao13LiquidoMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) Terço de Férias Líquido Proporcional</dt>
              <dd className="font-mono font-semibold tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.provisaoFeriasLiquidoMensal)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">(+) Vale-Refeição / Plano de Saúde</dt>
              <dd className="font-mono font-semibold tabular-nums text-emerald-700">
                + {formatBRL(resultado.clt.beneficiosLiquidos)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-200 font-extrabold text-base text-slate-900">
              <dt>Pacote Total Real CLT (Mensal)</dt>
              <dd className="font-mono tabular-nums text-blue-700">
                {formatBRL(resultado.clt.pacoteTotalMensalReal)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Detalhamento PJ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <h4 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <span>Raio-X no PJ • Simples Nacional</span>
            <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              NF: {formatBRL(faturamentoPJ)}
            </span>
          </h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">
                (-) Guia DAS Simples (Anexo {resultado.pj.anexoEfetivo} •{" "}
                <strong className="font-mono">
                  {formatPercent(resultado.pj.aliquotaEfetivaDAS)}
                </strong>
                )
              </dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(resultado.pj.valorDAS)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">
                (-) INSS sobre Pró-Labore ({formatBRL(resultado.pj.proLaboreSugerido)})
              </dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(resultado.pj.inssProLabore)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">(-) IRRF sobre Pró-Labore (Tabela 2026)</dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(resultado.pj.irpfProLabore)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">(-) Mensalidade Contabilidade Digital</dt>
              <dd className="font-mono font-semibold tabular-nums text-rose-600">
                - {formatBRL(resultado.pj.custoContabilidade)}
              </dd>
            </div>
            <div className="pt-3 mt-3 border-t border-dashed border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Indicadores Fiscais & Reforma Tributária 2026
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">Carga Tributária Efetiva Total no CNPJ</dt>
              <dd className="font-mono font-bold tabular-nums text-slate-800">
                {formatPercent(resultado.pj.cargaTributariaTotalPercentual)}
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">
                Economia obtida usando Fator R (28%)
              </dt>
              <dd className="font-mono font-bold tabular-nums text-emerald-700">
                + {formatBRL(resultado.pj.economiaMensalComFatorR)}/mês
              </dd>
            </div>
            <div className="flex justify-between text-xs">
              <dt className="text-slate-600">
                Destaque Reforma Tributária 2026 (CBS 0,9% + IBS 0,1%)
              </dt>
              <dd className="font-mono font-medium tabular-nums text-slate-600">
                {formatBRL(resultado.pj.reformaTributaria.valorDestaqueNota2026)} (Compensável)
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-200 font-extrabold text-base text-slate-900">
              <dt>Lucro Líquido Livre no Bolso (PJ)</dt>
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
