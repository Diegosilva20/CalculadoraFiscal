import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import FatorRCalculator from "@/components/FatorRCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { CNAES_DATA } from "@/data/cnaes";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Calculadora de Fator R Simples Nacional 2026 — Como Cair do Anexo V (15,5%) para o Anexo III (6%)",
  description:
    "Simule o Fator R (28%) da sua empresa no Simples Nacional em 2026: descubra o valor exato do pró-labore mensal para sair do Anexo V (15,5%) e pagar apenas 6% no Anexo III.",
};

export default function CalculadoraFatorRPage() {
  const cnaesComFatorR = CNAES_DATA.filter((c) => c.fatorR).slice(0, 12);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como calcular o Fator R do Simples Nacional em 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Fator R é calculado dividindo a soma da Folha de Salários dos últimos 12 meses (incluindo pró-labore dos sócios, salários de funcionários, 13º, INSS patronal e FGTS) pela Receita Bruta acumulada dos últimos 12 meses (RBT12). Se o resultado for igual ou superior a 28% (0,28), a empresa é tributada no Anexo III (a partir de 6%) em vez do Anexo V (a partir de 15,5%).",
        },
      },
      {
        "@type": "Question",
        name: "Por que o Fator R ficou ainda mais vantajoso em 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Com a nova regra de isenção do Imposto de Renda Pessoa Física (IRPF) para rendimentos de até R$ 5.000 mensais em 2026, sócios de empresas que faturam até R$ 17.850 por mês conseguem definir um pró-labore de 28% (até R$ 5.000) pagando R$ 0,00 de IRPF sobre o pró-labore, recolhendo apenas 11% de INSS e derrubando o DAS de 15,5% para 6%.",
        },
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Otimização Tributária PJ • Lei Complementar 123/2006 (Art. 18, § 5º-J)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Calculadora de Fator R 2026: Pague 6% (Anexo III) em vez de 15,5% (Anexo V)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Em 2026, a combinação do <strong>Fator R (28%)</strong> com a{" "}
          <strong>nova isenção de IRPF até R$ 5.000</strong> criou a maior oportunidade legal de redução de impostos para médicos, desenvolvedores, engenheiros, psicólogos, consultores e agências: quem fatura até R$ 17.850/mês consegue atingir os 28% de pró-labore <strong>sem pagar nada de Imposto de Renda Retido na Fonte</strong>.
        </p>
      </div>

      <FatorRCalculator />

      {/* Guia Prático Humanizado + Alto CPC Contábil/B2B */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          O que entra na conta dos 28% do Fator R e como evitar cair no Anexo V por erro de cálculo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              1. O que soma na Folha (FS12)
            </h3>
            <p>
              Para a Receita Federal (PGDAS-D), entram no numerador do Fator R: o valor bruto do <strong>pró-labore dos sócios</strong>, salários de empregados CLT, 13º salário, férias, valores pagos a autônomos (RPA) com retenção previdenciária, além do FGTS e do CPP (INSS Patronal). <strong>Distribuir lucros isentos não conta como folha!</strong>
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              2. O perigo do faturamento variável no mês
            </h3>
            <p>
              Se você emitir uma nota fiscal maior em um determinado mês e mantiver o pró-labore fixo antigo, o seu índice acumulado pode cair para <strong>27,9%</strong>. Por causa de 0,1%, o sistema da Receita Federal cobra <strong>15,5% sobre toda a nota fiscal do mês seguinte</strong>. Por isso, uma <strong>contabilidade digital especializada em PJ</strong> recalcula a guia do eSocial antes do fechamento de cada mês.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              3. Como funciona no primeiro mês do CNPJ?
            </h3>
            <p>
              Quando você abre seu CNPJ (SLU ou LTDA), ainda não existem 12 meses anteriores. Na primeira competência, a Receita Federal calcula a proporção <strong>dentro do próprio mês de abertura</strong>: basta que a guia de pró-labore gerada pela sua contabilidade represente pelo menos 28% das notas fiscais emitidas naquele primeiro mês.
            </p>
          </div>
        </div>

        {/* Lista de CNAEs que se beneficiam do Fator R */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 mb-3">
            Principais CNAEs que caem de 15,5% para 6% usando esta calculadora:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {cnaesComFatorR.map((c) => (
              <Link
                key={c.codigoLimpo}
                href={`/cnae/${c.slug}`}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-mono font-bold text-emerald-700 block">
                    CNAE {c.codigo}
                  </span>
                  <span className="text-slate-700 font-medium truncate block">
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
        label="Abra seu CNPJ ou Troque de Contador Grátis — Especialistas no Anexo III e Fator R para Médicos, Devs e Engenheiros"
      />

      <SnowballLinks currentSalary={12000} />
    </div>
  );
}
