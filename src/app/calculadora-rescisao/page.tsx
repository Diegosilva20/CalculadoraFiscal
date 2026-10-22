import React from "react";
import type { Metadata } from "next";
import RescisaoFeriasCalculator from "@/components/RescisaoFeriasCalculator";
import SnowballLinks from "@/components/SnowballLinks";

export const metadata: Metadata = {
  title:
    "Calculadora de Rescisão Trabalhista e Férias CLT 2026 — Acerto, Multa 40% FGTS e Aviso",
  description:
    "Simule o valor exato da sua Rescisão de Contrato de Trabalho CLT e Férias em 2026: demissão sem justa causa, acordo trabalhista (80% FGTS), pedido de demissão e venda de 10 dias de férias.",
};

export default function RescisaoPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Direitos Trabalhistas CLT 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Calculadora de Rescisão Trabalhista e Férias CLT 2026
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Vai mudar de emprego ou migrar da CLT para PJ? Calcule em segundos seu saldo de salário, aviso prévio proporcional, férias + 1/3, 13º proporcional e o valor liberado do FGTS com multa de 40% ou 20% (acordo).
        </p>
      </div>

      <RescisaoFeriasCalculator />

      <SnowballLinks currentSalary={5000} />
    </div>
  );
}
