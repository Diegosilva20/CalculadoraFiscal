import React from "react";
import type { Metadata } from "next";
import RescisaoFeriasCalculator from "@/components/RescisaoFeriasCalculator";
import SnowballLinks from "@/components/SnowballLinks";
import AdSlot from "@/components/AdSlot";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title:
    "Calculadora de Rescisão Trabalhista e Férias CLT 2026 — Acerto, Multa 40% FGTS e Aviso",
  description:
    "Simule o valor exato da sua Rescisão de Contrato de Trabalho CLT e Férias em 2026: demissão sem justa causa, acordo trabalhista (80% FGTS), pedido de demissão e venda de 10 dias de férias.",
  alternates: {
    canonical: "/calculadora-rescisao",
  },
};

export default function RescisaoPage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Calculadora de Rescisão Trabalhista e Férias CLT 2026",
    description:
      "Simulador de acerto rescisório CLT e férias 2026 com aviso prévio proporcional (Lei 12.506/2011), saldo de salário, 13º proporcional, férias + 1/3, abono pecuniário e multa de 40% do FGTS.",
    path: "/calculadora-rescisao",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Calculadora de Rescisão e Férias 2026", path: "/calculadora-rescisao" },
    ],
    faqs: [
      {
        question: "Qual o prazo legal para pagamento da rescisão CLT em 2026?",
        answer:
          "Pelo Art. 477, § 6º da CLT, o empregador tem até 10 dias corridos após o término do contrato para quitar todas as verbas rescisórias e entregar os documentos de saque do FGTS e Seguro-Desemprego, sob pena de multa equivalente a um salário bruto do empregado.",
      },
      {
        question: "Como funciona a demissão por acordo trabalhista (Art. 484-A da CLT)?",
        answer:
          "No acordo de demissão consensual, o trabalhador recebe metade do aviso prévio indenizado, 100% do saldo de salário, férias + 1/3 e 13º proporcional, multa rescisória de 20% sobre o FGTS e pode sacar até 80% do saldo total da conta do FGTS, mas não tem direito ao Seguro-Desemprego.",
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
          Legislação trabalhista · CLT e FGTS
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Calculadora de Rescisão Trabalhista e Férias CLT 2026
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Estime o valor líquido do acerto contratual, saldo de salário, aviso prévio proporcional (até 90 dias), 13º proporcional, férias mais um terço constitucional, abono pecuniário e saque de FGTS com multa.
        </p>
      </div>

      <RescisaoFeriasCalculator />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Prazos e regras da rescisão contratual e do FGTS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Prazo de pagamento de 10 dias corridos (Art. 477 da CLT)
              </h3>
              <p className="text-xs sm:text-sm">
                Independentemente de o aviso prévio ser trabalhado ou indenizado, a quitação das verbas rescisórias e a entrega dos documentos para saque do FGTS devem ocorrer em até <strong>10 dias corridos</strong> contados do término do contrato. O descumprimento sujeita o empregador à multa de um salário do empregado.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Saque-Aniversário e multa rescisória de 40%
              </h3>
              <p className="text-xs sm:text-sm">
                Na demissão sem justa causa, quem optou pelo Saque-Aniversário (ou possui contrato de antecipação do saque-aniversário) recebe normalmente a <strong>multa de 40%</strong> sobre o FGTS, enquanto o saldo remanescente permanece sujeito ao calendário anual de saques, salvo adesão às regras de liberação vigentes.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Alocação do acerto rescisório em liquidez diária
            </h3>
            <p className="text-xs sm:text-sm">
              Valores sacados da rescisão ou do FGTS destinados à reserva de transição profissional costumam ser alocados em CDBs de liquidez diária atrelados ao CDI (com cobertura do FGC até R$ 250 mil por instituição) ou no Tesouro Selic, permitindo resgate imediato em caso de transição para outro emprego ou abertura de CNPJ.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="rescisao-bottom-banner"
        format="leaderboard"
        label="CDB de liquidez diária e Tesouro Selic para reserva financeira"
      />

      <SnowballLinks currentSalary={5000} />
    </div>
  );
}
