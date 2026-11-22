import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { FAIXAS_SALARIAIS_SEO } from "@/data/profissoes";
import {
  DAS_MEI_SERVICOS_2026,
  TETO_ANUAL_MEI_2026,
  calculateCLTvsPJ,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export async function generateStaticParams() {
  return FAIXAS_SALARIAIS_SEO.map((valor) => ({
    valor: String(valor),
  }));
}

function parseSalarioParam(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1621 || n > 200000) return null;
  return n;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ valor: string }>;
}): Promise<Metadata> {
  const { valor } = await params;
  const salario = parseSalarioParam(valor);
  if (!salario) return {};

  const isOfficialBracket = FAIXAS_SALARIAIS_SEO.includes(salario);
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
    robots: isOfficialBracket
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function SalarioProgrammaticPage({
  params,
}: {
  params: Promise<{ valor: string }>;
}) {
  const { valor } = await params;
  const salario = parseSalarioParam(valor);
  if (!salario) notFound();

  const pjSugerido = Math.round(salario * 1.45);

  const simAnexoIII = calculateCLTvsPJ({
    salarioBrutoCLT: salario,
    faturamentoBrutoPJ: pjSugerido,
    beneficiosCLT: 900,
    anexoPJ: "V",
    sujeitoFatorR: true,
    otimizarFatorR: true,
  });

  const simAnexoV = calculateCLTvsPJ({
    salarioBrutoCLT: salario,
    faturamentoBrutoPJ: pjSugerido,
    beneficiosCLT: 900,
    anexoPJ: "V",
    sujeitoFatorR: false,
    otimizarFatorR: false,
  });

  const aliqEfetivaCLT =
    salario > 0 ? (simAnexoIII.clt.inss + simAnexoIII.clt.irpf) / salario : 0;

  // Diagnóstico exclusivo conforme a faixa de renda em 2026
  const diagnosticoFaixa =
    salario <= 5000
      ? {
          titulo: "Efeito da isenção de IRRF até R$ 5.000 e avaliação de MEI",
          texto: `Nesta faixa de ${formatBRL(salario)} na CLT, o Imposto de Renda Retido na Fonte (IRRF) é zerado em 2026, restando apenas o desconto progressivo do INSS (${formatBRL(simAnexoIII.clt.inss)}). Como a carga tributária na carteira já é baixa, propostas PJ próximas a ${formatBRL(pjSugerido)}/mês só compensam em Microempresa se houver expectativa de crescimento de faturamento; caso a atividade aceite MEI e a receita anual fique abaixo de ${formatBRL(TETO_ANUAL_MEI_2026)}, o DAS fixo mensal de serviços fica em ${formatBRL(DAS_MEI_SERVICOS_2026)}.`,
        }
      : salario <= 7000
      ? {
          titulo: "Faixa de transição do IRPF (entre R$ 5.000,01 e R$ 7.000,00)",
          texto: `Para quem recebe ${formatBRL(salario)} CLT em 2026, aplica-se o redutor gradual de IRRF antes da entrada plena na tabela progressiva, resultando em ${formatBRL(simAnexoIII.clt.irpf)} de Imposto de Renda e ${formatBRL(simAnexoIII.clt.inss)} de INSS. No CNPJ equivalente (${formatBRL(pjSugerido)}/mês), 28% de pró-labore equivale a ${formatBRL(simAnexoIII.pj.proLaboreSugerido)} — valor que também permanece abaixo do teto de isenção de IRRF até R$ 5.000.`,
        }
      : salario <= 12500
      ? {
          titulo: "Pró-labore do Fator R isento de IRRF na transição para PJ",
          texto: `Com salário CLT de ${formatBRL(salario)}, o trabalhador já atinge a alíquota marginal de 27,5% de IRRF (${formatBRL(simAnexoIII.clt.irpf)}/mês retidos na fonte). Já na proposta PJ equivalente de ${formatBRL(pjSugerido)}, configurar 28% do faturamento em pró-labore (${formatBRL(simAnexoIII.pj.proLaboreSugerido)}) habilita o Anexo III (6%) mantendo o pró-labore na faixa isenta ou de tributação mínima de IRPF.`,
        }
      : {
          titulo: "Teto previdenciário do INSS na CLT e escalonamento do Simples",
          texto: `Acima de R$ 12.500 na CLT, o INSS fica limitado ao teto de R$ 988,09, enquanto o IRRF consome ${formatBRL(simAnexoIII.clt.irpf)} todos os meses. No PJ com faturamento de ${formatBRL(pjSugerido)} (${formatBRL(pjSugerido * 12)}/ano), o RBT12 ultrapassa a primeira faixa do Simples Nacional (R$ 180 mil/ano), aplicando-se a alíquota efetiva progressiva de ${formatPercent(simAnexoIII.pj.aliquotaEfetivaDAS)} no Anexo III com economia anual estimada de ${formatBRL(simAnexoIII.pj.economiaMensalComFatorR * 12)} frente ao Anexo V.`,
        };

  const schemaGraph = buildCalculatorSchemaGraph({
    title: `Salário de R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?`,
    description: `Comparativo CLT vs PJ para salário de ${formatBRL(salario)}: desconto de INSS (${formatBRL(simAnexoIII.clt.inss)}), IRRF (${formatBRL(simAnexoIII.clt.irpf)}), pacote total (${formatBRL(simAnexoIII.clt.pacoteTotalMensalReal)}) e faturamento PJ equivalente (${formatBRL(simAnexoIII.faturamentoPJEquivalente)}).`,
    path: `/clt-vs-pj/salario/${salario}`,
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "CLT vs PJ 2026", path: "/clt-vs-pj" },
      { name: `R$ ${salario.toLocaleString("pt-BR")} CLT vs PJ`, path: `/clt-vs-pj/salario/${salario}` },
    ],
    faqs: [
      {
        question: `Quanto sobra líquido de um salário de R$ ${salario.toLocaleString("pt-BR")} CLT em 2026?`,
        answer: `Em 2026, um salário bruto de ${formatBRL(salario)} na carteira assinada tem desconto de ${formatBRL(simAnexoIII.clt.inss)} de INSS e ${formatBRL(simAnexoIII.clt.irpf)} de Imposto de Renda Retido na Fonte (IRRF), deixando ${formatBRL(simAnexoIII.clt.salarioLiquidoMensal)} líquidos por mês.`,
      },
      {
        question: `R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto como PJ em 2026?`,
        answer: `Somando salário líquido (${formatBRL(simAnexoIII.clt.salarioLiquidoMensal)}), depósito mensal de FGTS (${formatBRL(simAnexoIII.clt.fgtsMensal)}), 13º proporcional, férias + 1/3 e benefícios, o pacote CLT entrega ${formatBRL(simAnexoIII.clt.pacoteTotalMensalReal)}/mês. Para empatar atuando com CNPJ no Simples Nacional (Anexo III com 6% de imposto inicial), você precisa emitir nota fiscal de no mínimo ${formatBRL(simAnexoIII.faturamentoPJEquivalente)} mensais.`,
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
            {formatBRL(simAnexoIII.clt.salarioLiquidoMensal)} líquidos
          </strong>{" "}
          no holerite. Somando depósito de FGTS ({formatBRL(simAnexoIII.clt.fgtsMensal)}/mês), 13º proporcional ({formatBRL(simAnexoIII.clt.provisao13LiquidoMensal)}/mês diluído), adicional de férias e benefícios, a vaga corresponde a{" "}
          <strong className="text-slate-900">{formatBRL(simAnexoIII.clt.pacoteTotalMensalReal)} por mês</strong>. Para manter o mesmo poder de ganho no Simples Nacional (Anexo III), a nota fiscal PJ deve partir de{" "}
          <strong className="text-emerald-700">
            {formatBRL(simAnexoIII.faturamentoPJEquivalente)}/mês
          </strong>
          .
        </p>
      </div>

      <AdSlot
        slotId="salario-seo-top"
        format="leaderboard"
        label={`Abertura de CNPJ e Conta PJ para faturamento de ${formatBRL(simAnexoIII.faturamentoPJEquivalente)}`}
      />

      <CLTvsPJCalculator
        initialSalarioCLT={salario}
        initialFaturamentoPJ={pjSugerido}
      />

      {/* Tabela Comparativa SSR Exclusiva para esta Faixa Salarial (Programmatic SEO + GEO) */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6 text-sm text-slate-700 leading-relaxed">
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Comparativo completo para R$ {salario.toLocaleString("pt-BR")} CLT vs Nota Fiscal de {formatBRL(pjSugerido)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {diagnosticoFaixa.titulo}: {diagnosticoFaixa.texto}
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th scope="col" className="p-3.5 font-semibold">Indicador mensal</th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  CLT ({formatBRL(salario)})
                </th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  PJ Anexo III ({formatBRL(pjSugerido)})
                </th>
                <th scope="col" className="p-3.5 font-semibold text-right">
                  PJ Anexo V s/ Fator R
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3.5 font-medium">Bruto / Faturamento</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(salario)}</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(pjSugerido)}</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(pjSugerido)}</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Impostos, INSS e contabilidade</td>
                <td className="p-3.5 text-right font-mono text-rose-700">
                  - {formatBRL(simAnexoIII.clt.inss + simAnexoIII.clt.irpf)} ({formatPercent(aliqEfetivaCLT)})
                </td>
                <td className="p-3.5 text-right font-mono text-rose-700">
                  - {formatBRL(simAnexoIII.pj.totalImpostosECustos)} ({formatPercent(simAnexoIII.pj.cargaTributariaTotalPercentual)})
                </td>
                <td className="p-3.5 text-right font-mono text-rose-700">
                  - {formatBRL(simAnexoV.pj.totalImpostosECustos)} ({formatPercent(simAnexoV.pj.cargaTributariaTotalPercentual)})
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Líquido direto em conta</td>
                <td className="p-3.5 text-right font-mono font-semibold text-slate-900">
                  {formatBRL(simAnexoIII.clt.salarioLiquidoMensal)}
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-emerald-700">
                  {formatBRL(simAnexoIII.pj.lucroLiquidoIsento)}
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-slate-700">
                  {formatBRL(simAnexoV.pj.lucroLiquidoIsento)}
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="p-3.5">Patrimônio efetivo (c/ FGTS + 13º + férias)</td>
                <td className="p-3.5 text-right font-mono">
                  {formatBRL(simAnexoIII.clt.pacoteTotalMensalReal)}
                </td>
                <td className="p-3.5 text-right font-mono text-emerald-700">
                  {formatBRL(simAnexoIII.pj.lucroLiquidoIsento)}
                </td>
                <td className="p-3.5 text-right font-mono">
                  {formatBRL(simAnexoV.pj.lucroLiquidoIsento)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Deduções e previdência privada (PGBL)
            </h3>
            <p className="text-xs sm:text-sm">
              Na CLT, a calculadora testou automaticamente a dedução legal contra o desconto simplificado (aplicado:{" "}
              <strong>{simAnexoIII.clt.metodoIR}</strong>). Quem entrega a Declaração Completa de IRPF e possui retenção alta na fonte pode abater até 12% da renda bruta tributável anual aportando em previdência PGBL.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Plano de saúde empresarial e reserva financeira no CNPJ
            </h3>
            <p className="text-xs sm:text-sm">
              Ao migrar para PJ nesta faixa, considere o custo de um plano de saúde PME pelo CNPJ, os honorários de contabilidade online, a emissão de NFS-e via certificado digital e-CNPJ A1 e a aplicação mensal de reserva em CDB de liquidez diária para cobrir períodos de descanso.
            </p>
          </div>
        </div>
      </section>

      <SnowballLinks currentSalary={salario} seedKey={`sal-${salario}`} />
    </div>
  );
}
