import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import FatorRCalculator from "@/components/FatorRCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { CNAES_DATA } from "@/data/cnaes";
import { ArrowRight } from "lucide-react";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title:
    "Calculadora de Fator R Simples Nacional 2026 — Como Cair do Anexo V (15,5%) para o Anexo III (6%)",
  description:
    "Simule o Fator R (28%) da sua empresa no Simples Nacional em 2026: descubra o valor exato do pró-labore mensal para sair do Anexo V (15,5%) e pagar apenas 6% no Anexo III.",
  alternates: {
    canonical: "/calculadora-fator-r",
  },
};

export default function CalculadoraFatorRPage() {
  const cnaesComFatorR = CNAES_DATA.filter((c) => c.fatorR).slice(0, 12);

  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Calculadora de Fator R Simples Nacional 2026 (Anexo III vs Anexo V)",
    description:
      "Simulador do Fator R 28% (LC 123/2006) no Simples Nacional 2026 com cálculo de pró-labore ótimo, INSS, IRPF isento até R$ 5.000 e auditoria de 12 meses (RBT12 x FS12).",
    path: "/calculadora-fator-r",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Calculadora de Fator R 2026", path: "/calculadora-fator-r" },
    ],
    faqs: [
      {
        question: "Como calcular o Fator R do Simples Nacional em 2026?",
        answer:
          "O Fator R é calculado dividindo a soma da Folha de Salários dos últimos 12 meses (incluindo pró-labore dos sócios, salários de funcionários, 13º, INSS patronal e FGTS) pela Receita Bruta acumulada dos últimos 12 meses (RBT12). Se o resultado for igual ou superior a 28% (0,28), a empresa é tributada no Anexo III (a partir de 6%) em vez do Anexo V (a partir de 15,5%).",
      },
      {
        question: "Por que o Fator R ficou ainda mais vantajoso em 2026?",
        answer:
          "Com a nova regra de isenção do Imposto de Renda Pessoa Física (IRPF) para rendimentos de até R$ 5.000 mensais em 2026, sócios de empresas que faturam até R$ 17.850 por mês conseguem definir um pró-labore de 28% (até R$ 5.000) pagando R$ 0,00 de IRPF sobre o pró-labore, recolhendo apenas 11% de INSS e derrubando o DAS de 15,5% para 6%.",
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
          Simples Nacional · Lei Complementar nº 123/2006 (Art. 18, § 5º-J)
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Calculadora de Fator R 2026: Anexo III (6%) ou Anexo V (15,5%)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Com a isenção de IRPF até R$ 5.000 mensais em 2026, prestadores de serviços que faturam até cerca de R$ 17.850 por mês conseguem fixar o pró-labore em 28% da receita sem retenção de Imposto de Renda na fonte, pagando apenas INSS (11%) sobre a retirada para enquadrar o CNPJ no Anexo III.
        </p>
      </div>

      <FatorRCalculator />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Composição da folha de salários (FS12) e critérios de conferência mensal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Itens aceitos no cálculo dos 28%
              </h3>
              <p className="text-xs sm:text-sm">
                No PGDAS-D da Receita Federal, entram no numerador dos 12 meses: valor bruto do <strong>pró-labore dos sócios</strong>, salários de funcionários registrados em CLT, 13º salário, férias, pagamentos a autônomos (RPA) com retenção previdenciária e depósitos de FGTS. Distribuição de lucros isenta não compõe a folha para fins do Fator R.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Regra no mês de abertura do CNPJ
              </h3>
              <p className="text-xs sm:text-sm">
                Em empresas recém-abertas que ainda não acumularam 12 competências anteriores, a verificação da proporção de 28% considera apenas a folha e o faturamento do próprio mês de início das atividades.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Risco de oscilação de faturamento
            </h3>
            <p className="text-xs sm:text-sm">
              Quando a empresa emite notas fiscais de valores diferentes ao longo do ano e mantém um pró-labore fixo antigo, o acumulado pode cair para 27,9%. Uma diferença de um décimo percentual transfere toda a receita do período para o Anexo V (15,5% nominais), razão pela qual o acompanhamento mensal pela contabilidade digital evita distorções no fechamento do eSocial.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 mb-3">
            CNAEs elegíveis ao Fator R:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {cnaesComFatorR.map((c) => (
              <Link
                key={c.codigoLimpo}
                href={`/cnae/${c.slug}`}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-700 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-mono font-bold text-slate-900 block">
                    {c.codigo}
                  </span>
                  <span className="text-slate-600 truncate block">
                    {c.nomePopular}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSlot
        slotId="fator-r-bottom"
        format="leaderboard"
        label="Abertura e migração de contabilidade PJ para acompanhamento mensal de Anexo III e Fator R"
      />

      <SnowballLinks currentSalary={12000} />
    </div>
  );
}
