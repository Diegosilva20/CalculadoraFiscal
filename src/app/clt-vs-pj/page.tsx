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
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Simulador trabalhista e tributário · 2026
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Calculadora CLT vs PJ 2026: comparativo de rendimento líquido
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Confronte o <strong>salário líquido mensal e o pacote anual da CLT</strong> (incluindo FGTS de 8%, 13º salário, terço de férias e benefícios) com a retirada líquida obtida atuando via <strong>CNPJ no Simples Nacional</strong>.
        </p>
      </div>

      <AdSlot
        slotId="clt-pj-hub-top"
        format="leaderboard"
        label="Abertura de CNPJ e assessoria contábil para enquadramento no Anexo III"
      />

      <CLTvsPJCalculator initialSalarioCLT={8500} initialFaturamentoPJ={12500} />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900 mb-1.5">
          Tabela de equivalência CLT vs PJ 2026
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-5">
          Estimativa de faturamento bruto mínimo no Anexo III do Simples Nacional (com Fator R) para igualar o pacote total da CLT considerando R$ 900/mês em benefícios:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[11px]">
                <th scope="col" className="py-3 px-3">Salário bruto CLT</th>
                <th scope="col" className="py-3 px-3">Líquido mensal CLT</th>
                <th scope="col" className="py-3 px-3">Pacote CLT (FGTS + 13º + benef.)</th>
                <th scope="col" className="py-3 px-3 text-emerald-800">Mínimo equivalente PJ</th>
                <th scope="col" className="py-3 px-3">Detalhe</th>
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
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {formatBRL(sal)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {formatBRL(sim.clt.salarioLiquidoMensal)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {formatBRL(sim.clt.pacoteTotalMensalReal)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                      {formatBRL(sim.faturamentoPJEquivalente)}
                    </td>
                    <td className="py-2.5 px-3">
                      <Link
                        href={`/clt-vs-pj/salario/${sal}`}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Simular R$ {sal.toLocaleString("pt-BR")} →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Comparativo CLT vs PJ por profissão
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PROFISSOES_SEO.map((p) => (
            <Link
              key={p.slug}
              href={`/clt-vs-pj/profissao/${p.slug}`}
              className="p-4 rounded-lg border border-slate-200 hover:border-blue-700 hover:bg-slate-50 transition-colors"
            >
              <h3 className="font-semibold text-sm text-slate-900">{p.nome}</h3>
              <p className="text-xs text-slate-500 mt-1">
                CNAE {p.cnaeRecomendadoCodigo} · Anexo {p.anexoPadrao}
              </p>
              <span className="inline-block mt-2 text-xs font-semibold text-blue-700">
                Abrir cenário →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SnowballLinks currentSalary={8500} />
    </div>
  );
}
