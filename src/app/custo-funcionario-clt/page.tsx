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
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Simulador Empresarial de Folha & RH • Vigência 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Calculadora de Custo de Funcionário CLT 2026 (Simples, MEI e Lucro Presumido)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Descubra o custo real de uma contratação CLT para o caixa da sua empresa em 2026. Compare instantaneamente a diferença de encargos entre empresas do{" "}
          <strong>Simples Nacional</strong> (isentas dos 20% de INSS Patronal),{" "}
          <strong>MEI</strong> e <strong>Lucro Presumido / Real</strong>.
        </p>
      </div>

      <CustoFuncionarioCalculator />

      {/* Guia Prático Humanizado para Empresários + Palavras-Chave B2B de Alto CPC */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Como reduzir o custo da folha de pagamento legalmente em 2026
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              1. Cartão de Benefícios Flexíveis (PAT)
            </h3>
            <p>
              Dar aumento salarial direto na carteira gera efeito cascata sobre FGTS, INSS, 13º e férias. Ao oferecer valores através de um <strong>cartão de benefícios flexíveis (Vale-Refeição, Alimentação e Auxílio Home Office)</strong> enquadrado nas regras da CLT e do PAT, o valor chega 100% líquido para o colaborador sem incidência de INSS nem FGTS para a empresa.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              2. A Folha ajuda a bater o Fator R (28%)
            </h3>
            <p>
              Se a sua empresa presta serviços no <strong>Anexo V do Simples Nacional</strong> (como agências, clínicas, consultorias e empresas de software), o salário pago ao seu funcionário CLT e o FGTS dele <strong>somam no cálculo dos 28% do Fator R</strong>. Ou seja: contratar um funcionário pode derrubar o imposto sobre todo o faturamento da empresa de 15,5% para 6%!
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              3. Reserva de Provisão em Conta PJ Remunerada
            </h3>
            <p>
              Nunca deixe para tirar o 13º salário e o terço de férias do caixa de novembro e dezembro. Transfira todo mês o valor exato da provisão calculada acima para um subconta separada na sua <strong>Conta Digital PJ com rendimento de 100% do CDI</strong>: os próprios juros compostos ajudam a pagar os encargos de fim de ano.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="custo-funcionario-bottom"
        format="leaderboard"
        label="Reduza Custos da sua Empresa: Contabilidade B2B, Folha Digital e Benefícios Corporativos sem Taxa"
      />

      <SnowballLinks currentSalary={6000} />
    </div>
  );
}
