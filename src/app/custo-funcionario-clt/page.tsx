import React from "react";
import type { Metadata } from "next";
import CustoFuncionarioCalculator from "@/components/CustoFuncionarioCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { calculateCustoFuncionario2026, formatBRL, formatPercent } from "@/lib/calculators";
import { buildCalculatorSchemaGraph, buildSocialMetadata } from "@/lib/seo-schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageFAQSection from "@/components/PageFAQSection";

export const metadata: Metadata = buildSocialMetadata({
  title:
    "Calculadora de Custo de Funcionário e Encargos Trabalhistas CLT 2026 — Simples Nacional, Lucro Presumido e Lucro Real",
  description:
    "Calcule quanto custa um funcionário CLT e os encargos trabalhistas em 2026 no Simples Nacional (I–V e Anexo IV), MEI, Lucro Presumido e Lucro Real: FGTS, INSS patronal, RAT, Sistema S, 13º e férias.",
  path: "/custo-funcionario-clt",
});

const SALARIOS_REFERENCIA_EMPRESA = [2000, 3500, 5000, 8000];

const BREADCRUMBS = [
  { name: "Início", path: "/" },
  { name: "Custo de Funcionário CLT e Encargos 2026", path: "/custo-funcionario-clt" },
];

const FAQS = [
  {
    question: "Quanto custa um funcionário CLT para uma empresa no Simples Nacional em 2026?",
    answer:
      "No Simples Nacional (Anexos I, II, III e V), a empresa é isenta da cota patronal de 20% do INSS e do Sistema S. Somando FGTS (8%), provisão mensal de 13º salário (8,33%), férias + 1/3 (11,11%), FGTS sobre provisões e reserva para multa rescisória, os encargos trabalhistas representam cerca de 33,7% sobre o salário bruto, além dos benefícios (VR e VT).",
  },
  {
    question: "Quanto custa um funcionário no Lucro Presumido ou Lucro Real?",
    answer:
      "No Lucro Presumido e no Lucro Real, além de FGTS, 13º e férias, a empresa recolhe 20% de INSS Patronal, 1% a 3% de RAT e 5,8% de Terceiros (Sistema S) sobre a folha (totalizando +27,8% patronais sobre salário e provisões). Isso eleva os encargos trabalhista-previdenciários totais para cerca de 68% a 74% acima do salário bruto na carteira.",
  },
  {
    question: "Qual a diferença de custo no Simples Nacional Anexo IV?",
    answer:
      "Empresas do Anexo IV (como advocacia, construção civil, vigilância e limpeza) recolhem os 20% de INSS patronal + RAT (~2%) na folha, mas continuam isentas dos 5,8% de Terceiros (Sistema S), resultando em encargo patronal menor que o do Lucro Presumido ou Lucro Real.",
  },
];

export default function CustoFuncionarioPage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Calculadora de Custo de Funcionário CLT e Encargos Trabalhistas 2026",
    description:
      "Simulador empresarial de folha de pagamento e encargos trabalhistas 2026 comparando Simples Nacional (Anexos I–III–V e Anexo IV), MEI, Lucro Presumido e Lucro Real.",
    path: "/custo-funcionario-clt",
    breadcrumbs: BREADCRUMBS,
    faqs: FAQS,
  });

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <Breadcrumbs items={BREADCRUMBS} />

      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Orçamento de folha e encargos trabalhistas · 2026
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Calculadora de Custo de Funcionário e Encargos Trabalhistas CLT 2026
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Apure o desembolso mensal completo de uma contratação CLT no <strong>Simples Nacional</strong>, <strong>Anexo IV</strong>, <strong>Lucro Presumido</strong>, <strong>Lucro Real</strong> ou <strong>MEI</strong>, considerando FGTS, INSS patronal, RAT, Sistema S, provisões de 13º e férias com 1/3, reserva de multa 40% e benefícios.
        </p>
      </div>

      <CustoFuncionarioCalculator />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Tabela comparativa de custo CLT por regime tributário (2026)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Simulação padrão considerando apenas encargos e provisões obrigatórias (FGTS, 13º, férias + 1/3, multa 40% e INSS patronal, sem VR/VT adicionais):
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th scope="col" className="p-3.5 font-semibold">Salário bruto CLT</th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  Simples Nacional (I, II, III e V)
                </th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  Simples Anexo IV (+22,0%)
                </th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  Lucro Presumido / Real (+27,8%)
                </th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  MEI (1 empregado)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {SALARIOS_REFERENCIA_EMPRESA.map((sal) => {
                const s = calculateCustoFuncionario2026({
                  salarioBruto: sal,
                  regime: "simples_geral",
                  beneficiosVRPlano: 0,
                  gastoBrutoVT: 0,
                  incluirProvisaoMulta40: true,
                });
                const a4 = calculateCustoFuncionario2026({
                  salarioBruto: sal,
                  regime: "anexo_iv",
                  beneficiosVRPlano: 0,
                  gastoBrutoVT: 0,
                  incluirProvisaoMulta40: true,
                });
                const lp = calculateCustoFuncionario2026({
                  salarioBruto: sal,
                  regime: "lucro_presumido_real",
                  beneficiosVRPlano: 0,
                  gastoBrutoVT: 0,
                  incluirProvisaoMulta40: true,
                });
                const mei = calculateCustoFuncionario2026({
                  salarioBruto: sal,
                  regime: "mei",
                  beneficiosVRPlano: 0,
                  gastoBrutoVT: 0,
                  incluirProvisaoMulta40: true,
                });
                return (
                  <tr key={sal} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {formatBRL(sal)}
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <span className="font-semibold text-emerald-800 block">
                        {formatBRL(s.custoTotalMensalEmpresa)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        +{formatPercent(s.sobrecustoPercentual, 1)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <span className="font-semibold text-slate-900 block">
                        {formatBRL(a4.custoTotalMensalEmpresa)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        +{formatPercent(a4.sobrecustoPercentual, 1)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <span className="font-semibold text-rose-700 block">
                        {formatBRL(lp.custoTotalMensalEmpresa)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        +{formatPercent(lp.sobrecustoPercentual, 1)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <span className="font-semibold text-slate-800 block">
                        {formatBRL(mei.custoTotalMensalEmpresa)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        +{formatPercent(mei.sobrecustoPercentual, 1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Pontos de planejamento na folha de pagamento empresarial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Benefícios pelo PAT versus aumento salarial direto
              </h3>
              <p className="text-xs sm:text-sm">
                Reajustes no salário-base incidem em cascata sobre FGTS, 13º salário, adicional de férias e eventual INSS patronal. Conceder auxílio-alimentação ou cartão de benefícios flexíveis enquadrado no PAT evita essa base de encargos enquanto entrega valor integral ao colaborador.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Impacto da folha no Fator R (Anexo III)
              </h3>
              <p className="text-xs sm:text-sm">
                Para prestadoras de serviço do Simples Nacional enquadradas originalmente no Anexo V (15,5%), os salários de empregados CLT e os respectivos encargos entram na composição dos 28% do Fator R, podendo reduzir a tributação sobre o faturamento para a tabela do Anexo III (a partir de 6%).
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Provisionamento mensal em conta jurídica remunerada
            </h3>
            <p className="text-xs sm:text-sm">
              Separar mensalmente em uma subconta ou aplicação de liquidez diária (100% do CDI) o equivalente às provisões de 13º salário, terço de férias e reserva de multa do FGTS dilui o impacto no fluxo de caixa da empresa nos meses de novembro, dezembro e períodos de férias.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="custo-funcionario-bottom"
        format="leaderboard"
        label="Contabilidade empresarial, gestão de folha digital e benefícios corporativos"
      />

      <PageFAQSection faqs={FAQS} />

      <SnowballLinks currentSalary={6000} />
    </div>
  );
}
