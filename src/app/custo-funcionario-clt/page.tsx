import React from "react";
import type { Metadata } from "next";
import CustoFuncionarioCalculator from "@/components/CustoFuncionarioCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title:
    "Calculadora de Custo de Funcionário CLT para Empresa 2026 — Simples Nacional vs Lucro Presumido",
  description:
    "Calcule quanto custa um funcionário CLT para a empresa em 2026 no Simples Nacional, MEI e Lucro Presumido/Real: FGTS, INSS Patronal, provisão de 13º, férias + 1/3 e benefícios.",
  alternates: {
    canonical: "/custo-funcionario-clt",
  },
};

export default function CustoFuncionarioPage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Calculadora de Custo de Funcionário CLT para Empresa 2026",
    description:
      "Simulador empresarial de folha de pagamento 2026 comparando encargos trabalhistas e provisões (FGTS, 13º, Férias + 1/3, INSS Patronal) no Simples Nacional, MEI e Lucro Presumido/Real.",
    path: "/custo-funcionario-clt",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Custo de Funcionário CLT 2026", path: "/custo-funcionario-clt" },
    ],
    faqs: [
      {
        question: "Quanto custa um funcionário CLT para uma empresa no Simples Nacional em 2026?",
        answer:
          "No Simples Nacional (Anexos I, II, III e V), a empresa é isenta da cota patronal de 20% do INSS e do Sistema S. Somando FGTS (8%), provisão mensal de 13º salário (8,33%), férias + 1/3 (11,11%), FGTS sobre provisões e reserva para multa rescisória, os encargos trabalhistas representam cerca de 33,7% sobre o salário bruto, além dos benefícios (VR e VT).",
      },
      {
        question: "Quanto custa um funcionário no Lucro Presumido ou Lucro Real?",
        answer:
          "No Lucro Presumido, Lucro Real ou Anexo IV do Simples Nacional, além de FGTS, 13º e férias, a empresa recolhe 20% de INSS Patronal, 1% a 3% de RAT e 5,8% de Terceiros (Sistema S) sobre a folha. Isso eleva os encargos para cerca de 68% a 75% acima do salário bruto na carteira.",
      },
    ],
  });

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Orçamento de folha e encargos · 2026
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Calculadora de Custo de Funcionário CLT (Simples, MEI e Lucro Presumido)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Apure o desembolso mensal completo de uma contratação CLT considerando FGTS, INSS patronal, RAT, Sistema S, provisões mensais de 13º salário e férias com um terço, reserva de multa rescisória e benefícios.
        </p>
      </div>

      <CustoFuncionarioCalculator />

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

      <SnowballLinks currentSalary={6000} />
    </div>
  );
}
