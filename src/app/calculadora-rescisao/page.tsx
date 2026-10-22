import React from "react";
import type { Metadata } from "next";
import RescisaoFeriasCalculator from "@/components/RescisaoFeriasCalculator";
import SnowballLinks from "@/components/SnowballLinks";
import AdSlot from "@/components/AdSlot";

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
          Vai mudar de emprego ou migrar da CLT para PJ? Calcule em segundos seu saldo de salário, aviso prévio proporcional (até 90 dias), férias + 1/3, 13º proporcional e o valor liberado do FGTS com multa de 40% ou 20% (acordo).
        </p>
      </div>

      <RescisaoFeriasCalculator />

      {/* Guia Prático Humanizado + Termos de Alto CPC (FGTS, Investimento CDB/Selic, Acordo Trabalhista) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Regras práticas de pagamento da rescisão, saque do FGTS e venda de férias
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              1. Prazo de 10 dias corridos (Art. 477 da CLT)
            </h3>
            <p>
              Independentemente de o aviso prévio ter sido trabalhado ou indenizado, a empresa tem no máximo <strong>10 dias corridos</strong> a contar do término do contrato para depositar as verbas rescisórias na sua conta e entregar as guias do TRCT e chave de conectividade do FGTS. O atraso gera multa de 1 salário bruto inteiro a favor do trabalhador.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              2. Saque-Aniversário vs. Multa de 40% na Demissão
            </h3>
            <p>
              Quem aderiu à modalidade <strong>Saque-Aniversário do FGTS</strong> (ou contratou empréstimo de <strong>antecipação do saque-aniversário</strong> em bancos) e é demitido sem justa causa recebe normalmente a <strong>multa rescisória de 40%</strong> na conta, enquanto o saldo principal continua disponível nas parcelas anuais do mês de aniversário.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              3. Onde investir o dinheiro da rescisão e FGTS
            </h3>
            <p>
              O saldo parado no FGTS rende apenas 3% ao ano + TR (ou a reposição do IPCA). Ao sacar o acerto rescisório, aplicar o montante em um <strong>CDB de liquidez diária que pague 100% a 110% do CDI</strong> ou no <strong>Tesouro Selic</strong> entrega rendimento diário com segurança do FGC (Fundo Garantidor de Créditos até R$ 250 mil) e resgate imediato caso você decida abrir seu próprio CNPJ.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="rescisao-bottom-banner"
        format="leaderboard"
        label="Invista o valor da sua Rescisão em CDB Liquidez Diária 110% CDI com Garantia do FGC"
      />

      <SnowballLinks currentSalary={5000} />
    </div>
  );
}
