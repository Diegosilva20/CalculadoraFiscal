import React from "react";
import type { Metadata } from "next";
import SalarioLiquidoCalculator from "@/components/SalarioLiquidoCalculator";
import SnowballLinks from "@/components/SnowballLinks";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageFAQSection from "@/components/PageFAQSection";
import { buildCalculatorSchemaGraph, buildSocialMetadata } from "@/lib/seo-schema";

export const metadata: Metadata = buildSocialMetadata({
  title:
    "Calculadora de Salário Líquido e 13º Salário 2026 — Isenção IRPF R$ 5.000, Redutor e INSS",
  description:
    "Calcule seu Salário Líquido mensal e as duas parcelas do 13º Salário CLT em 2026 conforme a Lei nº 15.270/2025: isenção de IRRF até R$ 5.000, redutor gradual até R$ 7.350 e INSS progressivo.",
  path: "/calculadora-salario-liquido",
});

const BREADCRUMBS = [
  { name: "Início", path: "/" },
  { name: "Calculadora de Salário Líquido e 13º 2026", path: "/calculadora-salario-liquido" },
];

const FAQS = [
  {
    question: "Quem está isento de Imposto de Renda no salário CLT e no 13º em 2026?",
    answer:
      "Pela Lei nº 15.270/2025, trabalhadores com rendimento tributável mensal de até R$ 5.000,00 têm isenção total de Imposto de Renda Retido na Fonte (IRRF = R$ 0,00), regra aplicável também ao 13º salário (tributação exclusiva na fonte). Entre R$ 5.000,01 e R$ 7.350,00 aplica-se o redutor gradual de R$ 978,62 − (0,133145 × rendimento); acima de R$ 7.350,00 vale a tabela progressiva tradicional comparando automaticamente o desconto simplificado (R$ 607,20) com as deduções legais.",
  },
  {
    question: "Como funciona o pagamento da 1ª e da 2ª parcela do 13º salário em 2026?",
    answer:
      "A 1ª parcela deve ser paga até 30 de novembro e corresponde a 50% do salário bruto proporcional aos meses trabalhados no ano (cada mês com 15 dias ou mais conta como 1/12 avo), sem descontos de INSS nem IRRF. A 2ª parcela, paga até 20 de dezembro, quita a metade restante já deduzida do INSS e do IRRF calculados sobre o valor integral do 13º.",
  },
  {
    question: "Como funciona o desconto progressivo do INSS em 2026?",
    answer:
      "O INSS incide de forma fatiada por faixas salariais (7,5%, 9%, 12% e 14%) até o teto previdenciário de R$ 8.475,55 em 2026, cujo desconto máximo trava em R$ 988,09.",
  },
];

export default function SalarioLiquidoPage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Calculadora de Salário Líquido e 13º Salário CLT 2026 (Isenção IRPF até R$ 5.000)",
    description:
      "Simulador de Salário Líquido e 13º Salário CLT 2026 com cálculo de INSS progressivo, nova faixa de isenção de IRPF até R$ 5.000, desconto simplificado (R$ 607,20) e dedução por dependentes.",
    path: "/calculadora-salario-liquido",
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
          Holerite CLT e 13º Salário · Tabelas INSS e IRRF 2026
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Calculadora de Salário Líquido e 13º Salário 2026
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Simule o salário líquido mensal e a 1ª e 2ª parcela do 13º salário após os descontos progressivos do INSS (Portaria MPS/MF nº 13/2026) e do IRRF (Lei nº 15.270/2025), considerando isenção total até R$ 5.000,00 e redutor gradual até R$ 7.350,00.
        </p>
      </div>

      <SalarioLiquidoCalculator initialSalario={5500} />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Critérios de cálculo dos descontos em 2026
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Desconto simplificado ou deduções legais
              </h3>
              <p className="text-xs sm:text-sm">
                A Receita Federal permite substituir as deduções tradicionais (INSS mais R$ 189,59 por dependente) pelo desconto simplificado mensal de <strong>R$ 607,20</strong> na base do IRRF. A calculadora verifica automaticamente qual das duas opções gera a menor retenção para a faixa salarial informada.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Dedução anual com previdência PGBL
              </h3>
              <p className="text-xs sm:text-sm">
                Para quem recebe acima de R$ 7.350,00 e declara no modelo completo do IRPF, contribuições em planos de previdência privada PGBL permitem abater até 12% da renda bruta tributável anual no ajuste da Receita Federal.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Portabilidade de salário e crédito consignado CLT
            </h3>
            <p className="text-xs sm:text-sm">
              Trabalhadores que recebem em conta-salário indicada pelo empregador podem solicitar portabilidade gratuita para outra instituição bancária ou banco digital de sua preferência, além de consultar condições de crédito consignado privado vinculado à folha e ao FGTS com taxas reduzidas frente a linhas sem garantia.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="salario-liquido-bottom"
        format="leaderboard"
        label="Portabilidade de salário e conta digital com rendimento automático em CDI"
      />

      <PageFAQSection faqs={FAQS} />

      <SnowballLinks currentSalary={5500} />
    </div>
  );
}
