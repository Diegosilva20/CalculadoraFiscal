import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { FAIXAS_SALARIAIS_SEO } from "@/data/profissoes";
import { calculateCLTvsPJ, formatBRL, formatPercent } from "@/lib/calculators";

export async function generateStaticParams() {
  return FAIXAS_SALARIAIS_SEO.map((valor) => ({
    valor: String(valor),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ valor: string }>;
}): Promise<Metadata> {
  const { valor } = await params;
  const salario = Number(valor) || 8000;
  const sim = calculateCLTvsPJ({
    salarioBrutoCLT: salario,
    faturamentoBrutoPJ: Math.round(salario * 1.4),
  });

  return {
    title: `Salário de R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?`,
    description: `Ganhar R$ ${salario.toLocaleString("pt-BR")} CLT deixa ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos na conta. Para valer a pena como PJ em 2026, sua nota fiscal deve ser de pelo menos ${formatBRL(sim.faturamentoPJEquivalente)}. Simule aqui!`,
  };
}

export default async function SalarioProgrammaticPage({
  params,
}: {
  params: Promise<{ valor: string }>;
}) {
  const { valor } = await params;
  const salario = Math.max(1621, Math.min(100000, Number(valor) || 8000));
  const pjSugerido = Math.round(salario * 1.45);

  const sim = calculateCLTvsPJ({
    salarioBrutoCLT: salario,
    faturamentoBrutoPJ: pjSugerido,
    beneficiosCLT: 900,
  });

  // Dados Estruturados JSON-LD (FAQPage) para Rich Snippets no Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quanto é o salário líquido de R$ ${salario.toLocaleString("pt-BR")} CLT em 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Em 2026, um salário bruto de ${formatBRL(salario)} na CLT sofre desconto de ${formatBRL(sim.clt.inss)} de INSS e ${formatBRL(sim.clt.irpf)} de Imposto de Renda (IRRF), resultando em um salário líquido mensal de ${formatBRL(sim.clt.salarioLiquidoMensal)}.`,
        },
      },
      {
        "@type": "Question",
        name: `R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto como PJ em 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Considerando o salário líquido (${formatBRL(sim.clt.salarioLiquidoMensal)}), FGTS (${formatBRL(sim.clt.fgtsMensal)}/mês), 13º salário, 1/3 de férias e benefícios médios, o pacote real CLT vale ${formatBRL(sim.clt.pacoteTotalMensalReal)}/mês. Para empatar 100% atuando como PJ no Simples Nacional (Anexo III - 6%), você deve cobrar no mínimo ${formatBRL(sim.faturamentoPJEquivalente)} por mês.`,
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

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">
          Início
        </Link>
        <span>/</span>
        <Link href="/clt-vs-pj" className="hover:text-blue-600">
          CLT vs PJ 2026
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">
          R$ {salario.toLocaleString("pt-BR")} CLT vs PJ
        </span>
      </nav>

      {/* Cabeçalho Direto ao Ponto (Resposta Imediata + Retenção) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800">
          Estudo de Equivalência Salarial 2026
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Salário de R$ {salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?
        </h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Quem ganha <strong>{formatBRL(salario)} brutos na CLT</strong> em 2026 recebe{" "}
          <strong className="text-blue-700">
            {formatBRL(sim.clt.salarioLiquidoMensal)} líquidos por mês
          </strong>{" "}
          na conta bancária. Porém, somando FGTS ({formatBRL(sim.clt.fgtsMensal)}), 13º proporcional ({formatBRL(sim.clt.provisao13LiquidoMensal)}), férias + 1/3 e benefícios, seu pacote CLT vale{" "}
          <strong>{formatBRL(sim.clt.pacoteTotalMensalReal)}/mês</strong>. Por isso, para uma troca para PJ valer a pena no Simples Nacional, a proposta ideal deve partir de{" "}
          <strong className="text-emerald-700 underline">
            {formatBRL(sim.faturamentoPJEquivalente)}/mês
          </strong>.
        </p>
      </div>

      <AdSlot
        slotId="salario-seo-top"
        format="leaderboard"
        label={`Recebeu proposta PJ acima de ${formatBRL(sim.faturamentoPJEquivalente)}? Abra seu CNPJ grátis no Anexo III (6%)`}
      />

      {/* Calculadora pré-carregada exatamente com o salário da URL */}
      <CLTvsPJCalculator
        initialSalarioCLT={salario}
        initialFaturamentoPJ={pjSugerido}
      />

      {/* Perguntas Frequentes (SEO Semântico) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Perguntas Frequentes sobre Salário de R$ {salario.toLocaleString("pt-BR")} em 2026
        </h2>

        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-1">
              1. Qual o desconto de INSS e IRRF para R$ {salario.toLocaleString("pt-BR")} na CLT em 2026?
            </h3>
            <p>
              Pela tabela progressiva de 2026, o desconto de INSS é de{" "}
              <strong>{formatBRL(sim.clt.inss)}</strong> e o Imposto de Renda Retido na Fonte (IRRF) é de{" "}
              <strong>{formatBRL(sim.clt.irpf)}</strong> (utilizando o desconto{" "}
              {sim.clt.metodoIR}, que é o mais vantajoso para você). Sobra líquido no contracheque{" "}
              <strong>{formatBRL(sim.clt.salarioLiquidoMensal)}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-1">
              2. Quanto pago de imposto como PJ faturando {formatBRL(pjSugerido)} por mês?
            </h3>
            <p>
              No Simples Nacional (Anexo III ou usando o Fator R de 28%), a guia DAS fica em{" "}
              <strong>{formatBRL(sim.pj.valorDAS)}</strong> ({formatPercent(sim.pj.aliquotaEfetivaDAS)}), mais{" "}
              <strong>{formatBRL(sim.pj.inssProLabore + sim.pj.irpfProLabore)}</strong> de encargos sobre o pró-labore. Assim, sobram{" "}
              <strong className="text-emerald-700">
                {formatBRL(sim.pj.lucroLiquidoIsento)} líquidos e isentos de IR
              </strong>{" "}
              no seu bolso todos os meses.
            </p>
          </div>
        </div>
      </section>

      <SnowballLinks currentSalary={salario} />
    </div>
  );
}
