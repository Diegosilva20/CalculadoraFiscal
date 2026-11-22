import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CNAES_DATA, getCNAEBySlug } from "@/data/cnaes";
import { fetchCNAEFromIBGE } from "@/lib/gov-apis";
import CNAECalculator from "@/components/CNAECalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { Check, Info } from "lucide-react";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export async function generateStaticParams() {
  return CNAES_DATA.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cnae = getCNAEBySlug(slug);
  if (!cnae) return {};

  return {
    title: `CNAE ${cnae.codigo} (${cnae.nomePopular}): Anexo, Fator R, MEI e Imposto 2026`,
    description: `Consulta do CNAE ${cnae.codigo} (${cnae.titulo}) em 2026: ${
      cnae.permiteMEI ? "permite MEI" : "não permite MEI"
    }, tributação no Anexo ${cnae.anexo} (${
      cnae.fatorR
        ? "reduz para 6% com Fator R"
        : `inicia em ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}%`
    }). Simule a guia DAS.`,
    alternates: {
      canonical: `/cnae/${cnae.slug}`,
    },
  };
}

export default async function CNAEDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cnae = getCNAEBySlug(slug);
  if (!cnae) notFound();

  const dadosIBGE = await fetchCNAEFromIBGE(cnae.codigoLimpo);

  const schemaGraph = buildCalculatorSchemaGraph({
    title: `Calculadora e Consulta CNAE ${cnae.codigo} (${cnae.nomePopular}) — Simples Nacional 2026`,
    description: `Simulador de imposto DAS, Fator R e enquadramento MEI para o CNAE ${cnae.codigo} (${cnae.titulo}) no Simples Nacional 2026.`,
    path: `/cnae/${cnae.slug}`,
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Tabela CNAE 2026", path: "/cnae" },
      { name: `CNAE ${cnae.codigo}`, path: `/cnae/${cnae.slug}` },
    ],
    faqs: [
      {
        question: `O CNAE ${cnae.codigo} pode ser MEI em 2026?`,
        answer: cnae.permiteMEI
          ? `Sim. O CNAE ${cnae.codigo} (${cnae.titulo}) é permitido no MEI em 2026, respeitando o limite de faturamento anual de R$ 81.000.`
          : `Não. O CNAE ${cnae.codigo} (${cnae.titulo}) não é permitido no MEI por se tratar de atividade intelectual ou regulamentada, devendo ser aberto como Microempresa (ME / SLU) no Simples Nacional.`,
      },
      {
        question: `Qual o Anexo do Simples Nacional e alíquota do CNAE ${cnae.codigo}?`,
        answer: cnae.fatorR
          ? `O CNAE ${cnae.codigo} pertence originalmente ao Anexo V (15,5%), mas está sujeito ao Fator R. Mantendo 28% de folha/pró-labore, ele é tributado pelo Anexo III com alíquota inicial de apenas 6%.`
          : `O CNAE ${cnae.codigo} é tributado diretamente no Anexo ${cnae.anexo} do Simples Nacional, com alíquota nominal inicial de ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}% sem exigir Fator R.`,
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
        <Link href="/cnae" className="hover:text-blue-700">
          Tabela CNAE
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-800 font-mono">
          {cnae.codigo}
        </span>
      </nav>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {cnae.categoria}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono">
            Anexo {cnae.anexo} · Inicial {(cnae.aliquotaInicialNominal * 100).toFixed(1)}%
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
              cnae.permiteMEI
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {cnae.permiteMEI ? "Aceita MEI" : "Não permite MEI"}
          </span>
          {cnae.fatorR && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Sujeito ao Fator R (Anexo III a partir de 6%)
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          CNAE {cnae.codigo} — {cnae.titulo} ({cnae.nomePopular})
        </h1>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-sm text-slate-700">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
          <div>
            <strong className="block text-slate-900 mb-0.5">
              Enquadramento tributário em 2026:
            </strong>
            {cnae.dicaTributaria2026}
          </div>
        </div>
      </div>

      <CNAECalculator
        codigoCNAE={cnae.codigo}
        tituloCNAE={cnae.titulo}
        anexoPadrao={cnae.anexo}
        sujeitoFatorR={cnae.fatorR}
        permiteMEI={cnae.permiteMEI}
        reducaoIVA2026={cnae.reducaoIVA2026}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Atividades compreendidas no CNAE {cnae.codigo}
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            {cnae.atividadesCompreendidas.map((ativ, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{ativ}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Resumo fiscal 2026
          </h2>
          <div className="text-xs sm:text-sm space-y-2.5 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Enquadramento MEI</span>
              <strong className="text-slate-900">
                {cnae.permiteMEI ? "Permitido (até R$ 81.000/ano)" : "Não permitido (exige ME)"}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Anexo padrão</span>
              <strong className="text-slate-900">Anexo {cnae.anexo}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Regra do Fator R (28%)</span>
              <strong className="text-slate-900">
                {cnae.fatorR ? "Aplicável (migra para Anexo III)" : "Dispensado"}
              </strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Redução CBS/IBS (Reforma Tributária)</span>
              <strong className="text-blue-700 font-mono">
                {(cnae.reducaoIVA2026 * 100).toFixed(0)}% na alíquota IVA
              </strong>
            </div>
            {dadosIBGE && (
              <div className="pt-3 mt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-0.5">
                  Classificação oficial IBGE (CONCLA):
                </span>
                <span>
                  {dadosIBGE.secao} {dadosIBGE.divisao ? `· ${dadosIBGE.divisao}` : ""}
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">
          Procedimentos práticos para atuar com o CNAE {cnae.codigo}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p>
            <strong>Natureza jurídica e emissão de notas:</strong>{" "}
            {cnae.permiteMEI
              ? "Para faturamento anual até R$ 81.000 sem sócios, o registro pode ser feito como MEI no Portal do Empreendedor. Acima desse limite, a alternativa mais usual é a Sociedade Limitada Unipessoal (SLU) no Simples Nacional com emissão via certificado digital e-CNPJ A1."
              : "Como esta atividade não se enquadra no MEI, o formato mais utilizado para atuação individual é a SLU (Sociedade Limitada Unipessoal), mantendo separação patrimonial entre pessoa física e empresa, com emissão de NFS-e padrão nacional via certificado digital e-CNPJ A1."}
          </p>
          <p>
            <strong>Movimentação bancária e contabilidade:</strong> recomenda-se utilizar uma{" "}
            <strong>conta digital PJ</strong> própria para receber pelos serviços prestados, pagar a guia DAS mensal e recolher o pró-labore. A escrituração contábil regular feita pela contabilidade online permite transferir o lucro líquido restante para a conta pessoa física com isenção de IRPF.
          </p>
        </div>
      </section>

      <AdSlot
        slotId="cnae-bottom-banner"
        format="leaderboard"
        label={`Abertura de CNPJ no CNAE ${cnae.codigo}, certificado digital e-CNPJ A1 e Conta PJ`}
      />

      <SnowballLinks currentSalary={10000} />
    </div>
  );
}
