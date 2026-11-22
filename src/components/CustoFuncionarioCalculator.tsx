"use client";

import React, { useState } from "react";
import {
  RegimeEmpresaCLT,
  calculateCustoFuncionario2026,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import PrintButton from "./PrintButton";
import { getNearestSalarioSEO } from "@/data/faixas-salariais";
import Link from "next/link";
import { ArrowRight, Copy, Check } from "lucide-react";

const PRESETS_SALARIOS_EMPRESA = [
  { label: "R$ 2.000", salario: 2000, vr: 450, vt: 220 },
  { label: "R$ 3.500", salario: 3500, vr: 650, vt: 250 },
  { label: "R$ 6.000", salario: 6000, vr: 900, vt: 0 },
  { label: "R$ 10.000", salario: 10000, vr: 1200, vt: 0 },
];

export default function CustoFuncionarioCalculator() {
  const [salarioBruto, setSalarioBruto] = useState<number>(3500);
  const [regime, setRegime] = useState<RegimeEmpresaCLT>("simples_geral");
  const [beneficiosVRPlano, setBeneficiosVRPlano] = useState<number>(650);
  const [gastoBrutoVT, setGastoBrutoVT] = useState<number>(250);
  const [incluirProvisaoMulta40, setIncluirProvisaoMulta40] =
    useState<boolean>(true);
  const [copiado, setCopiado] = useState<boolean>(false);

  const {
    aliquotaINSSPatronalTotal,
    fgtsMensal,
    inssPatronalSobreSalario,
    provisao13Total,
    provisaoFeriasTotal,
    provisaoMultaFGTS,
    totalEncargosEProvisoes,
    totalBeneficiosEmpresa,
    custoTotalMensalEmpresa,
    sobrecustoPercentual,
    visaoTrabalhador,
    pctLiquidoTrabalhador,
    pctBeneficios,
    pctImpostosEProvisoes,
  } = calculateCustoFuncionario2026({
    salarioBruto,
    regime,
    beneficiosVRPlano,
    gastoBrutoVT,
    incluirProvisaoMulta40,
  });

  const copiarRelatorio = () => {
    const nomeRegime =
      regime === "simples_geral"
        ? "Simples Nacional (Anexos I, II, III ou V)"
        : regime === "anexo_iv"
        ? "Simples Nacional Anexo IV (CPP 20% + RAT)"
        : regime === "lucro_presumido_real"
        ? "Lucro Presumido / Real"
        : "MEI (1 empregado)";

    const texto = `Custo de Funcionário CLT 2026 (CalculaFiscal)\n- Regime: ${nomeRegime}\n- Salário na carteira: ${formatBRL(
      salarioBruto
    )}\n- Encargos e provisões (FGTS, 13º, Férias${
      aliquotaINSSPatronalTotal > 0 ? ", INSS Patronal" : ""
    }): ${formatBRL(totalEncargosEProvisoes)}/mês\n- Benefícios (VR, saúde e VT): ${formatBRL(
      totalBeneficiosEmpresa
    )}/mês\n- Custo total mensal: ${formatBRL(
      custoTotalMensalEmpresa
    )} (+${formatPercent(sobrecustoPercentual)})\n- Líquido recebido pelo funcionário: ${formatBRL(
      visaoTrabalhador.salarioLiquidoMensal
    )}`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <span className="text-xs font-semibold text-slate-600">
            Referências salariais para simulação:
          </span>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                  salarioBruto === p.salario
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-2">
            Regime tributário da empresa empregadora
          </span>
          <div
            role="group"
            aria-label="Selecionar regime tributário da empresa empregadora"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <button
              type="button"
              aria-pressed={regime === "simples_geral"}
              onClick={() => setRegime("simples_geral")}
              className={`p-3.5 rounded-lg border text-left transition-colors ${
                regime === "simples_geral"
                  ? "bg-blue-50/70 border-blue-700 ring-1 ring-blue-700"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                Simples (Anexos I, II, III e V)
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">
                Isento de CPP 20% e Sistema S
              </span>
            </button>

            <button
              type="button"
              aria-pressed={regime === "anexo_iv"}
              onClick={() => setRegime("anexo_iv")}
              className={`p-3.5 rounded-lg border text-left transition-colors ${
                regime === "anexo_iv"
                  ? "bg-blue-50/70 border-blue-700 ring-1 ring-blue-700"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                Simples Anexo IV
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                +22,0% patronal (CPP 20% + RAT, sem Sistema S)
              </span>
            </button>

            <button
              type="button"
              aria-pressed={regime === "lucro_presumido_real"}
              onClick={() => setRegime("lucro_presumido_real")}
              className={`p-3.5 rounded-lg border text-left transition-colors ${
                regime === "lucro_presumido_real"
                  ? "bg-blue-50/70 border-blue-700 ring-1 ring-blue-700"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                Lucro Presumido / Real
              </span>
              <span className="text-[11px] text-rose-700 font-medium">
                +27,8% (CPP 20%, RAT e Sistema S)
              </span>
            </button>

            <button
              type="button"
              aria-pressed={regime === "mei"}
              onClick={() => setRegime("mei")}
              className={`p-3.5 rounded-lg border text-left transition-colors ${
                regime === "mei"
                  ? "bg-blue-50/70 border-blue-700 ring-1 ring-blue-700"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                MEI (1 empregado)
              </span>
              <span className="text-[11px] text-slate-600 font-medium">
                INSS patronal de 3% + 8% de FGTS
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <label
              htmlFor="emp-salario"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Salário bruto em carteira (R$)
            </label>
            <input
              id="emp-salario"
              type="number"
              step={200}
              min={0}
              value={salarioBruto}
              onChange={(e) =>
                setSalarioBruto(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full px-3.5 py-2.5 text-base font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="emp-vr"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Vale-refeição e plano de saúde (R$/mês)
            </label>
            <input
              id="emp-vr"
              type="number"
              step={100}
              min={0}
              value={beneficiosVRPlano}
              onChange={(e) =>
                setBeneficiosVRPlano(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full px-3.5 py-2.5 text-base font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="emp-vt"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Gasto mensal com vale-transporte (R$)
            </label>
            <input
              id="emp-vt"
              type="number"
              step={50}
              min={0}
              value={gastoBrutoVT}
              onChange={(e) =>
                setGastoBrutoVT(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full px-3.5 py-2.5 text-base font-mono font-bold tabular-nums bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={incluirProvisaoMulta40}
            onChange={(e) => setIncluirProvisaoMulta40(e.target.checked)}
            className="w-4 h-4 accent-blue-700 rounded"
          />
          Considerar reserva mensal para multa rescisória de 40% do FGTS
        </label>
      </div>

      <AdSlot
        slotId="custo-funcionario-result"
        format="in-result"
        label="Gestão de folha, benefícios corporativos e contabilidade empresarial"
        estimatedCpc="CPC Médio: R$ 5,60 (Softwares de RH / Benefícios Corporativos / Contabilidade B2B)"
      />

      {/* Resumo Principal do Empregador */}
      <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-blue-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                Custo mensal efetivo para a empresa
              </span>
              <button
                type="button"
                onClick={copiarRelatorio}
                aria-live="polite"
                className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copiado ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copiar relatório
                  </>
                )}
              </button>
              <PrintButton />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Custo total:{" "}
              <span className="font-mono tabular-nums text-blue-700">
                {formatBRL(custoTotalMensalEmpresa)}/mês
              </span>
            </h3>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Para um salário base de{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(salarioBruto)}
              </strong>
              , a empresa aloca{" "}
              <strong className="font-mono text-slate-900">
                +{formatBRL(custoTotalMensalEmpresa - salarioBruto)}/mês (+
                {formatPercent(sobrecustoPercentual)})
              </strong>{" "}
              em encargos, provisões de 13º e férias e benefícios. Descontados INSS e IRRF, o empregado recebe{" "}
              <strong className="font-mono text-slate-900">
                {formatBRL(visaoTrabalhador.salarioLiquidoMensal)} líquidos
              </strong>
              .
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-5 min-w-[240px] border border-slate-200 shrink-0 space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
              Desembolso anual da vaga
            </span>
            <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">
              {formatBRL(custoTotalMensalEmpresa * 12)}/ano
            </p>
            <Link
              href={`/clt-vs-pj/salario/${getNearestSalarioSEO(salarioBruto)}`}
              className="no-print inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline pt-1"
            >
              Simular esta faixa em CLT vs PJ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Cunha salarial */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold text-sm sm:text-base text-slate-900">
            Divisão do custo total ({formatBRL(custoTotalMensalEmpresa)})
          </h4>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
              Líquido do trabalhador ({pctLiquidoTrabalhador.toFixed(0)}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
              Benefícios ({pctBeneficios.toFixed(0)}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 inline-block" />
              Encargos e provisões ({pctImpostosEProvisoes.toFixed(0)}%)
            </span>
          </div>
        </div>

        <div className="w-full h-4 rounded bg-slate-100 overflow-hidden flex">
          <div
            style={{ width: `${pctLiquidoTrabalhador}%` }}
            className="bg-emerald-600 h-full transition-all duration-300"
          />
          <div
            style={{ width: `${pctBeneficios}%` }}
            className="bg-blue-600 h-full transition-all duration-300"
          />
          <div
            style={{ width: `${pctImpostosEProvisoes}%` }}
            className="bg-rose-600 h-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Detalhamento de Custos */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="font-bold text-base text-slate-900 mb-4 border-b border-slate-200 pb-3">
          Discriminação de encargos e provisões mensais
        </h4>
        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-700 font-medium">
              Salário base em carteira
            </span>
            <span className="font-mono font-bold tabular-nums text-slate-900">
              {formatBRL(salarioBruto)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">FGTS mensal (8%)</span>
            <span className="font-mono font-medium tabular-nums text-rose-700">
              + {formatBRL(fgtsMensal)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              INSS Patronal, RAT e Sistema S ({formatPercent(aliquotaINSSPatronalTotal, 1)})
            </span>
            <span className="font-mono font-medium tabular-nums text-rose-700">
              + {formatBRL(inssPatronalSobreSalario)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              Provisão mensal de 13º salário e encargos
            </span>
            <span className="font-mono font-medium tabular-nums text-amber-800">
              + {formatBRL(provisao13Total)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              Provisão mensal de férias + 1/3 e encargos
            </span>
            <span className="font-mono font-medium tabular-nums text-amber-800">
              + {formatBRL(provisaoFeriasTotal)}
            </span>
          </div>
          {incluirProvisaoMulta40 && (
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                Reserva para multa de 40% do FGTS
              </span>
              <span className="font-mono font-medium tabular-nums text-amber-800">
                + {formatBRL(provisaoMultaFGTS)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-600">
              Benefícios líquidos (VR, plano de saúde e diferença de VT)
            </span>
            <span className="font-mono font-medium tabular-nums text-blue-700">
              + {formatBRL(totalBeneficiosEmpresa)}
            </span>
          </div>
          <div className="flex justify-between pt-3 font-bold text-base text-slate-900">
            <span>Custo mensal total para o empregador</span>
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
