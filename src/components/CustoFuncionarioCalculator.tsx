"use client";

import React, { useState } from "react";
import {
  calculateSalarioLiquidoCLT,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import Link from "next/link";
import {
  Building2,
  Users,
  ArrowRight,
  Copy,
  Check,
  Zap,
  BarChart3,
} from "lucide-react";

type RegimeEmpresa = "simples_geral" | "lucro_presumido_real" | "mei";

const PRESETS_SALARIOS_EMPRESA = [
  { label: "Salário R$ 2.000", salario: 2000, vr: 450, vt: 220 },
  { label: "Salário R$ 3.500", salario: 3500, vr: 650, vt: 250 },
  { label: "Salário R$ 6.000", salario: 6000, vr: 900, vt: 0 },
  { label: "Salário R$ 10.000", salario: 10000, vr: 1200, vt: 0 },
];

export default function CustoFuncionarioCalculator() {
  const [salarioBruto, setSalarioBruto] = useState<number>(3500);
  const [regime, setRegime] = useState<RegimeEmpresa>("simples_geral");
  const [beneficiosVRPlano, setBeneficiosVRPlano] = useState<number>(650);
  const [gastoBrutoVT, setGastoBrutoVT] = useState<number>(250);
  const [incluirProvisaoMulta40, setIncluirProvisaoMulta40] =
    useState<boolean>(true);
  const [copiado, setCopiado] = useState<boolean>(false);

  // Alíquotas patronais conforme o regime tributário da empresa
  // Simples Nacional (Anexos I, II, III e V): isento de INSS Patronal 20%, RAT e Sistema S
  // Lucro Presumido / Real / Simples Anexo IV: 20% INSS Patronal + 2% RAT médio + 5,8% Sistema S (Terceiros) = 27,8%
  // MEI: 3% INSS Patronal + 8% FGTS
  const aliquotaINSSPatronalTotal =
    regime === "simples_geral"
      ? 0
      : regime === "mei"
      ? 0.03
      : 0.278;

  const fgtsMensal = salarioBruto * 0.08;
  const inssPatronalSobreSalario = salarioBruto * aliquotaINSSPatronalTotal;

  // Provisão mensal de 13º salário (1/12 = 8,333%) + encargos (FGTS 8% + INSS Patronal) sobre 13º
  const provisao13Base = salarioBruto / 12;
  const encargosSobre13 = provisao13Base * (0.08 + aliquotaINSSPatronalTotal);
  const provisao13Total = provisao13Base + encargosSobre13;

  // Provisão mensal de Férias + 1/3 Constitucional (1/12 * 4/3 = 11,111%) + encargos
  const provisaoFeriasBase = (salarioBruto * (4 / 3)) / 12;
  const encargosSobreFerias =
    provisaoFeriasBase * (0.08 + aliquotaINSSPatronalTotal);
  const provisaoFeriasTotal = provisaoFeriasBase + encargosSobreFerias;

  // Provisão técnica para Multa de 40% do FGTS (40% sobre o FGTS do salário, 13º e férias = ~4,0% do salário)
  const fgtsTotalMensalEProvisoes =
    fgtsMensal + provisao13Base * 0.08 + provisaoFeriasBase * 0.08;
  const provisaoMultaFGTS = incluirProvisaoMulta40
    ? fgtsTotalMensalEProvisoes * 0.4
    : 0;

  // Custo efetivo de Vale-Transporte para a empresa (o que exceder 6% do salário bruto)
  const descontoMaximoVTFuncionario = salarioBruto * 0.06;
  const custoLiquidoVTEmpresa = Math.max(
    0,
    gastoBrutoVT - descontoMaximoVTFuncionario
  );

  const totalEncargosEProvisoes =
    fgtsMensal +
    inssPatronalSobreSalario +
    provisao13Total +
    provisaoFeriasTotal +
    provisaoMultaFGTS;

  const totalBeneficiosEmpresa = beneficiosVRPlano + custoLiquidoVTEmpresa;

  const custoTotalMensalEmpresa =
    salarioBruto + totalEncargosEProvisoes + totalBeneficiosEmpresa;

  const sobrecustoPercentual =
    salarioBruto > 0 ? (custoTotalMensalEmpresa - salarioBruto) / salarioBruto : 0;

  // Quanto chega líquido na mão do trabalhador (para mostrar a "Cunha Fiscal")
  const visãoTrabalhador = calculateSalarioLiquidoCLT({
    salarioBruto,
    beneficiosMensais: beneficiosVRPlano,
    descontarVT: gastoBrutoVT > 0,
  });

  const pctLiquidoTrabalhador =
    (visãoTrabalhador.salarioLiquidoMensal / Math.max(1, custoTotalMensalEmpresa)) *
    100;
  const pctBeneficios =
    (totalBeneficiosEmpresa / Math.max(1, custoTotalMensalEmpresa)) * 100;
  const pctImpostosEProvisoes = Math.max(
    0,
    100 - pctLiquidoTrabalhador - pctBeneficios
  );

  const copiarRelatorio = () => {
    const nomeRegime =
      regime === "simples_geral"
        ? "Simples Nacional (Anexo I, II, III ou V)"
        : regime === "lucro_presumido_real"
        ? "Lucro Presumido / Real (ou Anexo IV)"
        : "MEI";

    const texto = `🏢 *Custo de Funcionário CLT 2026 (CalculaFiscal)*\n• Regime da Empresa: ${nomeRegime}\n• Salário na Carteira: ${formatBRL(
      salarioBruto
    )}\n• (+) Encargos e Provisões (FGTS, 13º, Férias${
      aliquotaINSSPatronalTotal > 0 ? ", INSS Patronal" : ""
    }): ${formatBRL(totalEncargosEProvisoes)}/mês\n• (+) Benefícios (VR/Saúde/VT): ${formatBRL(
      totalBeneficiosEmpresa
    )}/mês\n• 💰 *Custo Total Mensal p/ Empresa: ${formatBRL(
      custoTotalMensalEmpresa
    )}* (+${formatPercent(sobrecustoPercentual)} sobre o salário)\n• Líquido que cai na conta do funcionário: ${formatBRL(
      visãoTrabalhador.salarioLiquidoMensal
    )}`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-7">
      {/* Atalhos Rápidos + Regime Tributário */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Zap className="w-4 h-4 text-amber-500" />
            Simular Faixa Salarial da Vaga:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS_SALARIOS_EMPRESA.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSalarioBruto(p.salario);
                  setBeneficiosVRPlano(p.vr);
                  setGastoBrutoVT(p.vt);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                  salarioBruto === p.salario
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de Regime Tributário do Empregador */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            1. Qual o Regime Tributário da sua Empresa? (Muda drasticamente o INSS Patronal)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setRegime("simples_geral")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                regime === "simples_geral"
                  ? "bg-blue-50/90 border-blue-600 ring-1 ring-blue-600"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                Simples Nacional (Anexos I, II, III e V)
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                ✅ Isento dos 20% de INSS Patronal + Sistema S
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRegime("lucro_presumido_real")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                regime === "lucro_presumido_real"
                  ? "bg-blue-50/90 border-blue-600 ring-1 ring-blue-600"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                Lucro Presumido / Real (ou Anexo IV)
              </span>
              <span className="text-[11px] text-rose-700 font-semibold">
                ⚠️ Paga +27,8% (INSS Patronal 20% + RAT + Sistema S)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRegime("mei")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                regime === "mei"
                  ? "bg-blue-50/90 border-blue-600 ring-1 ring-blue-600"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                MEI (1 Funcionário)
              </span>
              <span className="text-[11px] text-blue-700 font-semibold">
                INSS Patronal reduzido de apenas 3% + 8% FGTS
              </span>
            </button>
          </div>
        </div>

        {/* Campos de Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Salário Bruto na Carteira (R$)
            </label>
            <input
              type="number"
              step={200}
              min={1621}
              value={salarioBruto}
              onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 text-lg font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vale-Refeição + Plano de Saúde (R$/mês)
            </label>
            <input
              type="number"
              step={100}
              min={0}
              value={beneficiosVRPlano}
              onChange={(e) => setBeneficiosVRPlano(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 text-lg font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gasto Total c/ Passagens VT (R$/mês)
            </label>
            <input
              type="number"
              step={50}
              min={0}
              value={gastoBrutoVT}
              onChange={(e) => setGastoBrutoVT(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 text-lg font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={incluirProvisaoMulta40}
            onChange={(e) => setIncluirProvisaoMulta40(e.target.checked)}
            className="w-4 h-4 accent-blue-600 rounded"
          />
          Incluir reserva mensal para Multa Rescisória de 40% do FGTS (recomendado para fluxo de caixa)
        </label>
      </div>

      <AdSlot
        slotId="custo-funcionario-result"
        format="in-result"
        label="Gestão de Folha de Pagamento, Cartão de Benefícios Flexíveis (Flash/Caju) e Contabilidade Empresarial"
        estimatedCpc="CPC Médio: R$ 5,60 (Softwares de RH / Benefícios Corporativos / Contabilidade B2B)"
      />

      {/* Card Principal do Custo para a Empresa */}
      <div className="rounded-3xl bg-slate-950 bg-fintech-grid text-white p-6 sm:p-8 border-2 border-blue-500/80 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Building2 className="w-3.5 h-3.5" />
                Desembolso Real da Empresa (2026)
              </span>
              <button
                type="button"
                onClick={copiarRelatorio}
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
                    Copiar Relatório de Custo
                  </>
                )}
              </button>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold">
              Custo Total:{" "}
              <span className="font-mono tabular-nums text-emerald-400">
                {formatBRL(custoTotalMensalEmpresa)}/mês
              </span>
            </h3>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Para pagar um salário de carteira de{" "}
              <strong className="font-mono text-white">
                {formatBRL(salarioBruto)}
              </strong>
              , sua empresa desembolsa{" "}
              <strong className="font-mono text-amber-300">
                +{formatBRL(custoTotalMensalEmpresa - salarioBruto)}/mês (+
                {formatPercent(sobrecustoPercentual)})
              </strong>{" "}
              em encargos, provisões de 13º/férias e benefícios. Enquanto isso, após descontar INSS e IRRF, chegam{" "}
              <strong className="font-mono text-white">
                {formatBRL(visãoTrabalhador.salarioLiquidoMensal)} líquidos
              </strong>{" "}
              na conta bancária do funcionário.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 min-w-[250px] border border-white/15 shrink-0 space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block">
              Custo Anual do Posto (12 meses)
            </span>
            <p className="text-2xl font-mono font-bold tabular-nums text-white">
              {formatBRL(custoTotalMensalEmpresa * 12)}/ano
            </p>
            <Link
              href={`/clt-vs-pj/salario/${Math.min(50000, Math.max(1750, Math.round(salarioBruto / 250) * 250))}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:underline pt-1"
            >
              Comparar esta vaga como PJ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Termômetro da "Cunha Fiscal" Trabalhista */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              Para onde vão os {formatBRL(custoTotalMensalEmpresa)} que saem do caixa da empresa?
            </h4>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              Líquido na Mão do Funcionário ({pctLiquidoTrabalhador.toFixed(0)}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
              VR/Saúde/VT ({pctBeneficios.toFixed(0)}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
              Impostos, FGTS e Provisões ({pctImpostosEProvisoes.toFixed(0)}%)
            </span>
          </div>
        </div>

        <div className="w-full h-6 rounded-xl bg-slate-100 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${pctLiquidoTrabalhador}%` }}
            className="bg-emerald-500 h-full transition-all duration-300"
          />
          <div
            style={{ width: `${pctBeneficios}%` }}
            className="bg-blue-500 h-full transition-all duration-300"
          />
          <div
            style={{ width: `${pctImpostosEProvisoes}%` }}
            className="bg-rose-500 h-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Tabela Discriminada de Encargos e Provisões */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <h4 className="font-extrabold text-base text-slate-900 mb-4 border-b border-slate-100 pb-3">
          Planilha Analítica de Custos Mensais do Funcionário (2026)
        </h4>
        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600 font-medium">
              1. Salário Base Bruto em Folha
            </span>
            <span className="font-mono font-bold tabular-nums text-slate-900">
              {formatBRL(salarioBruto)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              2. FGTS Mensal Obrigatório (8%)
            </span>
            <span className="font-mono font-semibold tabular-nums text-rose-600">
              + {formatBRL(fgtsMensal)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              3. INSS Patronal + RAT + Sistema S ({formatPercent(aliquotaINSSPatronalTotal, 1)})
            </span>
            <span className="font-mono font-semibold tabular-nums text-rose-600">
              + {formatBRL(inssPatronalSobreSalario)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              4. Provisão Mensal de 13º Salário (1/12 + encargos sobre 13º)
            </span>
            <span className="font-mono font-semibold tabular-nums text-amber-700">
              + {formatBRL(provisao13Total)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              5. Provisão Mensal de Férias + 1/3 Constitucional (+ encargos)
            </span>
            <span className="font-mono font-semibold tabular-nums text-amber-700">
              + {formatBRL(provisaoFeriasTotal)}
            </span>
          </div>
          {incluirProvisaoMulta40 && (
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                6. Reserva Técnica para Multa de 40% do FGTS
              </span>
              <span className="font-mono font-semibold tabular-nums text-amber-700">
                + {formatBRL(provisaoMultaFGTS)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              7. Benefícios (VR/VA/Saúde + Custo Líquido de Vale-Transporte)
            </span>
            <span className="font-mono font-semibold tabular-nums text-blue-700">
              + {formatBRL(totalBeneficiosEmpresa)}
            </span>
          </div>
          <div className="flex justify-between pt-3 font-extrabold text-base text-slate-900">
            <span>Custo Total Mensal para o Empregador</span>
            <span className="font-mono tabular-nums text-blue-700">
              {formatBRL(custoTotalMensalEmpresa)}
            </span>
          </div>
        </div>
      </div>

      <LegalDisclaimerBox />
    </div>
  );
}
