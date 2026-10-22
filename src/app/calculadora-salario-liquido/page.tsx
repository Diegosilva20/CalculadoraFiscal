import React from "react";
import type { Metadata } from "next";
import SalarioLiquidoCalculator from "@/components/SalarioLiquidoCalculator";
import SnowballLinks from "@/components/SnowballLinks";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title:
    "Calculadora de Salário Líquido 2026 — Com Nova Isenção de IRPF até R$ 5.000 e INSS",
  description:
    "Calcule seu Salário Líquido CLT em 2026 com a nova tabela de isenção de Imposto de Renda até R$ 5.000, desconto progressivo para salários até R$ 7.000 e INSS atualizado.",
};

export default function SalarioLiquidoPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Tabela Oficial INSS & IRRF 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Calculadora de Salário Líquido CLT 2026 (Isenção até R$ 5.000)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Veja quanto cai na sua conta bancária após os descontos do INSS progressivo e do Imposto de Renda Retido na Fonte (IRRF) em 2026, já com a{" "}
          <strong>isenção para salários brutos até R$ 5.000,00</strong> e o desconto gradual para quem ganha entre R$ 5.000,01 e R$ 7.000,00.
        </p>
      </div>

      <SalarioLiquidoCalculator initialSalario={5500} />

      {/* Guia Prático Humanizado + Termos de Alto CPC (Bancos, Previdência PGBL, Consignado) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Como funcionam os descontos do holerite em 2026 e como pagar menos IRPF
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              1. Desconto Simplificado vs. Dedução por Dependentes
            </h3>
            <p>
              A Receita Federal permite deduzir <strong>R$ 607,20 fixos por mês</strong> (Desconto Simplificado) da base do Imposto de Renda, mesmo que você não tenha dependentes. Nossa calculadora testa automaticamente os dois modelos e aplica as deduções legais (INSS + R$ 189,59 por dependente) sempre que a soma ultrapassar R$ 607,20.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              2. Restituição via Previdência Privada PGBL
            </h3>
            <p>
              Para salários acima de R$ 7.000 que caem na alíquota de 27,5% de IRPF e entregam a Declaração Completa, aportar até 12% da renda bruta tributável anual em um plano de <strong>Previdência Privada PGBL</strong> deduz diretamente a base de cálculo do imposto, transformando o valor que iria para a Receita em patrimônio investido em renda fixa ou fundos.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              3. Portabilidade Salarial e Crédito Consignado CLT
            </h3>
            <p>
              Mesmo recebendo pela conta-salário indicada pela empresa, você pode solicitar a <strong>portabilidade salarial gratuita</strong> pelo aplicativo do seu banco digital preferido para ter isenção na cesta de serviços e acesso a linhas de <strong>crédito consignado privado (e-Consignado FGTS)</strong> com juros muito menores que o rotativo do cartão.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="salario-liquido-bottom"
        format="leaderboard"
        label="Faça a Portabilidade do seu Salário para Conta Digital com Rendimento Automático de 100% do CDI"
      />

      <SnowballLinks currentSalary={5500} />
    </div>
  );
}
