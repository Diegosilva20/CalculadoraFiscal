import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { PROFISSOES_SEO, getProfissaoBySlug } from "@/data/profissoes";
import { calculateCLTvsPJ, formatBRL, formatPercent } from "@/lib/calculators";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export async function generateStaticParams() {
  return PROFISSOES_SEO.map((prof) => ({
    slug: prof.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prof = getProfissaoBySlug(slug);
  if (!prof) return {};

  const sim = calculateCLTvsPJ({
    salarioBrutoCLT: prof.salarioMedioCLT,
    faturamentoBrutoPJ: prof.propostaMediaPJ,
    beneficiosCLT: prof.beneficiosMediosCLT,
    anexoSimples: prof.sujeitoFatorR ? "III" : prof.anexoPadrao,
    usarFatorR28: prof.sujeitoFatorR,
  });

  return {
    title: prof.tituloSEO,
    description: `Para ${prof.nome}, salário CLT de ${formatBRL(prof.salarioMedioCLT)} deixa ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos (pacote real ${formatBRL(sim.clt.pacoteTotalMensalReal)}). Veja quanto pedir como PJ no CNAE ${prof.cnaeRecomendadoCodigo}.`,
    alternates: {
      canonical: `/clt-vs-pj/profissao/${prof.slug}`,
    },
  };
}

export default async function ProfissaoProgrammaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prof = getProfissaoBySlug(slug);
  if (!prof) notFound();

  const sim = calculateCLTvsPJ({
    salarioBrutoCLT: prof.salarioMedioCLT,
    faturamentoBrutoPJ: prof.propostaMediaPJ,
    beneficiosCLT: prof.beneficiosMediosCLT,
    anexoSimples: prof.sujeitoFatorR ? "III" : prof.anexoPadrao,
    usarFatorR28: prof.sujeitoFatorR,
  });

  const schemaGraph = buildCalculatorSchemaGraph({
    title: prof.tituloSEO,
    description: `Comparativo CLT vs PJ 2026 para ${prof.nome} com CNAE ${prof.cnaeRecomendadoCodigo}, cálculo de INSS, IRPF, FGTS, Fator R e Simples Nacional.`,
    path: `/clt-vs-pj/profissao/${prof.slug}`,
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "CLT vs PJ 2026", path: "/clt-vs-pj" },
      { name: prof.nome, path: `/clt-vs-pj/profissao/${prof.slug}` },
    ],
    faqs: [
      {
        question: `Qual o CNAE mais indicado para ${prof.nome} atuar como PJ em 2026?`,
        answer: `O código mais utilizado por ${prof.nome} é o CNAE ${prof.cnaeRecomendadoCodigo}, tributado originalmente no Anexo ${prof.anexoPadrao} do Simples Nacional. ${
          prof.sujeitoFatorR
            ? "Como esta atividade é sujeita ao Fator R (LC 123/2006), ao manter 28% do faturamento em folha/pró-labore a alíquota nominal inicial cai de 15,50% para 6,00% no Anexo III."
            : "Esta atividade já ingressa diretamente no Anexo padrão sem exigir a trava de 28% do Fator R."
        }`,
      },
      {
        question: `Quanto um ${prof.nome} que ganha ${formatBRL(prof.salarioMedioCLT)} CLT precisa faturar como PJ para valer a pena?`,
        answer: `Um salário bruto de ${formatBRL(prof.salarioMedioCLT)} na CLT entrega ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos por mês e um pacote real acumulado (incluindo FGTS de ${formatBRL(sim.clt.fgtsMensal)}, 13º, férias + 1/3 e benefícios de ${formatBRL(prof.beneficiosMediosCLT)}) de ${formatBRL(sim.clt.pacoteTotalMensalReal)}. Para empatar no bolso atuando como PJ, a nota fiscal mínima de equilíbrio é de ${formatBRL(sim.faturamentoPJEquivalente)}.`,
      },
    ],
  });

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">
          Início
        </Link>
        <span>/</span>
        <Link href="/clt-vs-pj" className="hover:text-blue-600">
          CLT vs PJ 2026
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{prof.nome}</span>
      </nav>

      {/* Cabeçalho com Passagem Direta Citável (GEO 40-60 palavras) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800">
            Guia da Profissão 2026
          </span>
          <Link
            href={`/cnae/${prof.cnaeRecomendadoSlug}`}
            className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
          >
            CNAE Recomendado: {prof.cnaeRecomendadoCodigo} (Anexo {prof.anexoPadrao}) →
          </Link>
          {prof.sujeitoFatorR && (
            <Link
              href="/calculadora-fator-r"
              className="text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
            >
              ⚡ Sujeito ao Fator R (Cai para 6% no Anexo III)
            </Link>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          {prof.tituloSEO}
        </h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {prof.resumoMercado2026} Na média nacional de 2026, uma vaga CLT de{" "}
          <strong>{formatBRL(prof.salarioMedioCLT)}</strong> para{" "}
          <strong>{prof.nome}</strong> deixa{" "}
          <strong className="text-blue-700">
            {formatBRL(sim.clt.salarioLiquidoMensal)} líquidos no holerite
          </strong>{" "}
          e soma um pacote real de{" "}
          <strong>{formatBRL(sim.clt.pacoteTotalMensalReal)}/mês</strong> (contando FGTS, 13º, férias e {formatBRL(prof.beneficiosMediosCLT)} de benefícios). Já uma proposta PJ de{" "}
          <strong>{formatBRL(prof.propostaMediaPJ)}</strong> gera{" "}
          <strong className="text-emerald-700">
            {formatBRL(sim.pj.liquidoTotalMensal)} livres por mês
          </strong>{" "}
          — um ganho líquido extra de{" "}
          <strong>{formatBRL(sim.diferencaMensalNoBolso * 12)} por ano</strong>.
        </p>
      </div>

      <AdSlot
        slotId="profissao-seo-top"
        format="leaderboard"
        label={`Contabilidade Especializada para ${prof.nome} (CNAE ${prof.cnaeRecomendadoCodigo}) — Reduza seu imposto para 6%`}
      />

      <CLTvsPJCalculator
        initialSalarioCLT={prof.salarioMedioCLT}
        initialFaturamentoPJ={prof.propostaMediaPJ}
        initialBeneficiosCLT={prof.beneficiosMediosCLT}
        initialAnexo={prof.sujeitoFatorR ? "III" : prof.anexoPadrao}
        profissaoNome={prof.nome}
        cnaeRecomendado={{
          codigo: prof.cnaeRecomendadoCodigo,
          slug: prof.cnaeRecomendadoSlug,
        }}
      />

      {/* Tabela Comparativa SSR & Diagnóstico Contábil Exclusivo da Profissão (Padrão Programmatic SEO + GEO) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Quanto sobra no bolso de {prof.nome}: CLT ({formatBRL(prof.salarioMedioCLT)}) vs PJ ({formatBRL(prof.propostaMediaPJ)})?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Para atuar como <strong>{prof.nome}</strong> na modalidade Pessoa Jurídica em 2026, o ponto de equilíbrio financeiro frente a um salário CLT de {formatBRL(prof.salarioMedioCLT)} ocorre a partir da nota fiscal de{" "}
            <strong className="text-slate-900">{formatBRL(sim.faturamentoPJEquivalente)}/mês</strong>. Confira na tabela abaixo a auditoria linha a linha do cenário padrão de mercado:
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3.5 font-bold">Indicador Financeiro (2026)</th>
                <th className="p-3.5 font-bold text-right">Regime CLT ({formatBRL(prof.salarioMedioCLT)})</th>
                <th className="p-3.5 font-bold text-right bg-emerald-950 text-emerald-300">
                  Regime PJ ({formatBRL(prof.propostaMediaPJ)})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3.5 font-medium">Remuneração Bruta / Nota Fiscal</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(prof.salarioMedioCLT)}</td>
                <td className="p-3.5 text-right font-mono font-semibold bg-emerald-50/40">
                  {formatBRL(prof.propostaMediaPJ)}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Impostos e Retenções Mensais (INSS + IRPF + DAS)</td>
                <td className="p-3.5 text-right font-mono text-rose-700">
                  - {formatBRL(sim.clt.inss + sim.clt.irpf)} ({formatPercent(sim.clt.aliquotaEfetivaTotal)})
                </td>
                <td className="p-3.5 text-right font-mono text-rose-700 bg-emerald-50/40">
                  - {formatBRL(sim.pj.impostoTotalMensal)} ({formatPercent(sim.pj.aliquotaEfetivaTotal)})
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Dinheiro Líquido Imediato na Conta</td>
                <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                  {formatBRL(sim.clt.salarioLiquidoMensal)}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-800 bg-emerald-50/40">
                  {formatBRL(sim.pj.liquidoTotalMensal)}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Direitos Indiretos Diluídos (FGTS + 13º + Férias + Benefícios)</td>
                <td className="p-3.5 text-right font-mono text-blue-700">
                  + {formatBRL(sim.clt.pacoteTotalMensalReal - sim.clt.salarioLiquidoMensal)}
                </td>
                <td className="p-3.5 text-right font-mono text-slate-500 bg-emerald-50/40">
                  Incluso no faturamento
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="p-3.5">Patrimônio Mensal Efetivo (Líquido + Provisões)</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(sim.clt.pacoteTotalMensalReal)}</td>
                <td className="p-3.5 text-right font-mono text-emerald-700 bg-emerald-100/60">
                  {formatBRL(sim.pj.liquidoTotalMensal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              1. Enquadramento no CNAE {prof.cnaeRecomendadoCodigo}
            </h3>
            <p>
              Para emitir notas fiscais como <strong>{prof.nome}</strong> sem risco de autuação municipal ou federal, utilize o{" "}
              <Link
                href={`/cnae/${prof.cnaeRecomendadoSlug}`}
                className="text-blue-700 font-semibold underline hover:text-blue-900"
              >
                CNAE {prof.cnaeRecomendadoCodigo}
              </Link>{" "}
              em uma Sociedade Limitada Unipessoal (SLU).{" "}
              {prof.sujeitoFatorR
                ? `Como ele pertence originalmente ao Anexo V (15,5%), configure o Fator R de 28% com sua contabilidade digital para derrubar a guia DAS inicial para 6,0% no Anexo III.`
                : `A grande vantagem deste código é entrar diretamente no Anexo ${prof.anexoPadrao}, pagando a menor alíquota inicial do Simples Nacional desde o primeiro mês.`}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              2. Conta Digital PJ e Separação Contábil
            </h3>
            <p>
              Receba o pagamento das notas fiscais exclusivamente em uma <strong>conta digital PJ gratuita</strong> (como BTG Empresas, Cora ou Inter Empresas). Após quitar o DAS e o pró-labore, transfira os{" "}
              <strong>{formatBRL(sim.pj.lucroLiquidoIsento)} de distribuição de lucros</strong> para sua pessoa física com isenção de Imposto de Renda.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              3. Plano de Saúde PME e Reserva de Férias
            </h3>
            <p>
              Substitua os {formatBRL(prof.beneficiosMediosCLT)} de benefícios da CLT contratando um <strong>plano de saúde empresarial pelo CNPJ</strong> (até 35% mais barato que planos individuais PF) e alocando mensalmente {formatBRL(sim.clt.fgtsMensal + sim.clt.provisaoFeriasLiquidaMensal)} em um CDB 100% CDI de liquidez diária para cobrir suas férias remuneradas.
            </p>
          </div>
        </div>
      </section>

      <SnowballLinks currentSalary={prof.salarioMedioCLT} />
    </div>
  );
}
