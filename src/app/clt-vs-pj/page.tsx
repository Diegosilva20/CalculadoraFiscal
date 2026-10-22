import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import { calculateCLTvsPJ, formatBRL } from "@/lib/calculators";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Calculadora CLT vs PJ 2026 — Simulador Completo com Fator R e Isenção IRPF",
  description:
    "Compare propostas CLT vs PJ em 2026 considerando INSS progressivo, nova isenção de IRPF até R$ 5.000, FGTS, 13º, Férias e Fator R (6%) no Simples Nacional.",
  alternates: {
    canonical: "/clt-vs-pj",
  },
};

export default function CLTvsPJHubPage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Calculadora CLT vs PJ 2026 — Simulador de Salário Líquido e Impostos PJ",
    description:
      "Compare remuneração CLT vs PJ em 2026 com cálculo de INSS, IRPF (isenção até R$ 5.000), FGTS, 13º, Férias + 1/3, Simples Nacional (Anexos III, IV e V) e Fator R (28%).",
    path: "/clt-vs-pj",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Calculadora CLT vs PJ 2026", path: "/clt-vs-pj" },
    ],
    faqs: [
      {
        question: "Qual o multiplicador ideal para trocar CLT por PJ em 2026?",
        answer:
          "Para compensar FGTS (8%), 13º salário, férias remuneradas + 1/3, aviso prévio, benefícios corporativos e os impostos/contabilidade do CNPJ no Simples Nacional, a nota fiscal PJ costuma precisar ser entre 1,35x e 1,50x o valor do salário bruto CLT.",
      },
    ],
  });

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Simulador Trabalhista & Tributário • Atualizado 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Calculadora CLT vs PJ 2026: Qual compensa mais no seu caso?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Não olhe apenas para o valor bruto da Nota Fiscal. Nossa calculadora compara o{" "}
          <strong>Salário Líquido na conta</strong> e também o{" "}
          <strong>Patrimônio Real Anual</strong> (somando FGTS de 8%, 13º salário, terço de férias e benefícios) contra os impostos reais do CNPJ no Simples Nacional.
        </p>
      </div>

      <AdSlot
        slotId="clt-pj-hub-top"
        format="leaderboard"
        label="Vai mudar de CLT para PJ? Abra sua empresa gratuitamente com assessoria tributária no Anexo III"
      />

      <CLTvsPJCalculator initialSalarioCLT={8500} initialFaturamentoPJ={12500} />

      {/* Tabela Rápida de Equivalência CLT vs PJ 2026 (Rica em palavras-chave para o Google) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Tabela de Equivalência CLT vs PJ 2026 (Ponto de Equilíbrio)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Veja quanto você precisa cobrar como PJ (no Anexo III do Simples Nacional) para empatar 100% com todos os direitos e benefícios da CLT:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-3 px-3">Salário Bruto CLT</th>
                <th className="py-3 px-3">Líquido Mensal CLT</th>
                <th className="py-3 px-3">Pacote Total CLT (c/ FGTS+13º+VR)</th>
                <th className="py-3 px-3 text-emerald-700">Mínimo Ideal PJ (Nota Fiscal)</th>
                <th className="py-3 px-3">Simulação Detalhada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FAIXAS_SALARIAIS_SEO.map((sal) => {
                const sim = calculateCLTvsPJ({
                  salarioBrutoCLT: sal,
                  faturamentoBrutoPJ: Math.round(sal * 1.45),
                  beneficiosCLT: 900,
                });
                return (
                  <tr key={sal} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatBRL(sal)}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {formatBRL(sim.clt.salarioLiquidoMensal)}
                    </td>
                    <td className="py-3 px-3 font-medium text-blue-700">
                      {formatBRL(sim.clt.pacoteTotalMensalReal)}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">
                      {formatBRL(sim.faturamentoPJEquivalente)}
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/clt-vs-pj/salario/${sal}`}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Abrir cálculo de R$ {sal.toLocaleString("pt-BR")} →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lista de Profissões */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">
          Calculadora CLT vs PJ por Profissão (2026)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PROFISSOES_SEO.map((p) => (
            <Link
              key={p.slug}
              href={`/clt-vs-pj/profissao/${p.slug}`}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 transition-all"
            >
              <h3 className="font-bold text-sm text-slate-900">{p.nome}</h3>
              <p className="text-xs text-slate-500 mt-1">
                CNAE {p.cnaeRecomendadoCodigo} • Anexo {p.anexoPadrao}
              </p>
              <span className="inline-block mt-2 text-xs font-bold text-blue-600">
                Simular profissão →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SnowballLinks currentSalary={8500} />
    </div>
  );
}
