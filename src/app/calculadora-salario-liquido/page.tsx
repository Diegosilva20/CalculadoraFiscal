import React from "react";
import type { Metadata } from "next";
import SalarioLiquidoCalculator from "@/components/SalarioLiquidoCalculator";
import SnowballLinks from "@/components/SnowballLinks";

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
          Descubra exatamente quanto cai na sua conta após os descontos do INSS progressivo e do Imposto de Renda 2026, já aplicando automaticamente a{" "}
          <strong>isenção para quem ganha até R$ 5.000,00</strong> e o redutor gradual até R$ 7.000,00.
        </p>
      </div>

      <SalarioLiquidoCalculator initialSalario={5500} />

      <SnowballLinks currentSalary={5500} />
    </div>
  );
}
