import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { PROFISSOES_SEO, getProfissaoBySlug } from "@/data/profissoes";
import { formatBRL } from "@/lib/calculators";

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

  return {
    title: prof.tituloSEO,
    description: `Simulador CLT vs PJ 2026 exclusivo para ${prof.nome}. Compare salário líquido, CNAE recomendado (${prof.cnaeRecomendadoCodigo}), Anexo ${prof.anexoPadrao} e Fator R.`,
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

  return (
    <div className="space-y-10">
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

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800">
            Guia da Profissão 2026
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
            CNAE Recomendado: {prof.cnaeRecomendadoCodigo} (Anexo {prof.anexoPadrao})
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          {prof.tituloSEO}
        </h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {prof.resumoMercado2026} Abaixo, carregamos a simulação padrão de mercado para{" "}
          <strong>{prof.nome}</strong> (Média CLT de{" "}
          <strong>{formatBRL(prof.salarioMedioCLT)}</strong> vs. Proposta PJ de{" "}
          <strong>{formatBRL(prof.propostaMediaPJ)}</strong>). Ajuste com os seus valores reais:
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

      <SnowballLinks currentSalary={prof.salarioMedioCLT} />
    </div>
  );
}
