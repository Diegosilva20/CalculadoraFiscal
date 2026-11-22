import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { FAIXAS_SALARIAIS_SEO } from "@/data/profissoes";
import { calculateCLTvsPJ, formatBRL } from "@/lib/calculators";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

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
    faturamentoBrutoPJ: Math.round(salario * 1.45),
  });

  return {
    title: `Salário de R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?`,
    description: `Ganhar R$ ${salario.toLocaleString("pt-BR")} CLT deixa ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos na conta. Para empatar como PJ no Simples Nacional em 2026, a nota fiscal parte de ${formatBRL(sim.faturamentoPJEquivalente)}.`,
    alternates: {
      canonical: `/clt-vs-pj/salario/${salario}`,
    },
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

  const schemaGraph = buildCalculatorSchemaGraph({
    title: `Salário de R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?`,
    description: `Comparativo CLT vs PJ para salário de ${formatBRL(salario)}: desconto de INSS (${formatBRL(sim.clt.inss)}), IRRF (${formatBRL(sim.clt.irpf)}), pacote total (${formatBRL(sim.clt.pacoteTotalMensalReal)}) e faturamento PJ equivalente (${formatBRL(sim.faturamentoPJEquivalente)}).`,
    path: `/clt-vs-pj/salario/${salario}`,
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "CLT vs PJ 2026", path: "/clt-vs-pj" },
      { name: `R$ ${salario.toLocaleString("pt-BR")} CLT vs PJ`, path: `/clt-vs-pj/salario/${salario}` },
    ],
    faqs: [
      {
        question: `Quanto sobra líquido de um salário de R$ ${salario.toLocaleString("pt-BR")} CLT em 2026?`,
        answer: `Em 2026, um salário bruto de ${formatBRL(salario)} na carteira assinada tem desconto de ${formatBRL(sim.clt.inss)} de INSS e ${formatBRL(sim.clt.irpf)} de Imposto de Renda Retido na Fonte (IRRF), deixando ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos por mês.`,
      },
      {
        question: `R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto como PJ em 2026?`,
        answer: `Somando salário líquido (${formatBRL(sim.clt.salarioLiquidoMensal)}), depósito mensal de FGTS (${formatBRL(sim.clt.fgtsMensal)}), 13º proporcional, férias + 1/3 e benefícios, o pacote CLT entrega ${formatBRL(sim.clt.pacoteTotalMensalReal)}/mês. Para empatar atuando com CNPJ no Simples Nacional (Anexo III com 6% de imposto inicial), você precisa emitir nota fiscal de no mínimo ${formatBRL(sim.faturamentoPJEquivalente)} mensais.`,
      },
    ],
  });

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-700">
          Início
        </Link>
        <span>/</span>
        <Link href="/clt-vs-pj" className="hover:text-blue-700">
          CLT vs PJ
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-800">
          R$ {salario.toLocaleString("pt-BR")}
        </span>
      </nav>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-3">
        <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Equivalência salarial · Tabelas 2026
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Salário de R$ {salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Um salário bruto de <strong>{formatBRL(salario)} na CLT</strong> gera{" "}
          <strong className="text-slate-900">
            {formatBRL(sim.clt.salarioLiquidoMensal)} líquidos
          </strong>{" "}
          no holerite. Somando depósito de FGTS ({formatBRL(sim.clt.fgtsMensal)}/mês), 13º proporcional ({formatBRL(sim.clt.provisao13LiquidoMensal)}/mês diluído), adicional de férias e benefícios, a vaga corresponde a{" "}
          <strong className="text-slate-900">{formatBRL(sim.clt.pacoteTotalMensalReal)} por mês</strong>. Para manter o mesmo poder de ganho no Simples Nacional (Anexo III), a nota fiscal PJ deve partir de{" "}
          <strong className="text-emerald-700">
            {formatBRL(sim.faturamentoPJEquivalente)}/mês
          </strong>
          .
        </p>
      </div>

      <AdSlot
        slotId="salario-seo-top"
        format="leaderboard"
        label={`Abertura de CNPJ e Conta PJ para faturamento de ${formatBRL(sim.faturamentoPJEquivalente)}`}
      />

      <CLTvsPJCalculator
        initialSalarioCLT={salario}
        initialFaturamentoPJ={pjSugerido}
      />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          O que pesa na migração de R$ {salario.toLocaleString("pt-BR")} CLT para CNPJ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Descontos na carteira em 2026
              </h3>
              <p className="text-xs sm:text-sm">
                Nesta faixa, o INSS progressivo retém{" "}
                <strong>{formatBRL(sim.clt.inss)}</strong> e o IRRF retém{" "}
                <strong>{formatBRL(sim.clt.irpf)}</strong> (critério:{" "}
                {sim.clt.metodoIR}). Contribuintes que entregam a Declaração Completa podem reduzir parte do imposto anual aplicando até 12% da renda tributável em previdência privada PGBL.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Enquadramento MEI ou Microempresa (ME)
              </h3>
              <p className="text-xs sm:text-sm">
                Com faturamento de {formatBRL(pjSugerido)}/mês ({formatBRL(pjSugerido * 12)}/ano),{" "}
                {pjSugerido * 12 <= 81000
                  ? "o valor fica dentro do limite anual de R$ 81.000 do MEI caso a atividade seja permitida na lista oficial."
                  : "a receita supera o limite anual de R$ 81.000 do MEI, exigindo abertura de Microempresa (SLU) no Simples Nacional com emissão de NFS-e via certificado digital e-CNPJ A1."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Redução para 6% via Fator R e contabilidade online
              </h3>
              <p className="text-xs sm:text-sm">
                Atividades intelectuais enquadradas originalmente no Anexo V (15,5%) podem pagar a alíquota inicial do Anexo III (6%) ajustando o pró-labore em 28% do faturamento. A diferença de carga tributária nesta faixa chega a{" "}
                <strong className="text-emerald-700">
                  {formatBRL(sim.pj.economiaMensalComFatorR * 12)}/ano
                </strong>
                .
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Plano de saúde empresarial e reserva equivalente ao FGTS
              </h3>
              <p className="text-xs sm:text-sm">
                Substitua os benefícios da CLT por um plano de saúde empresarial PME via CNPJ (tabelas costumam ser 30% menores que planos individuais PF) e separe mensalmente em conta PJ ou CDB de liquidez diária o valor referente às suas férias e 13º.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SnowballLinks currentSalary={salario} />
    </div>
  );
}
