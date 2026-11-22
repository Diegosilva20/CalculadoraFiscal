import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CNAES_DATA, getCNAEBySlug } from "@/data/cnaes";
import { PROFISSOES_SEO } from "@/data/profissoes";
import { fetchCNAEFromIBGE } from "@/lib/gov-apis";
import CNAECalculator from "@/components/CNAECalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageFAQSection from "@/components/PageFAQSection";
import { Check, Info, ArrowRight } from "lucide-react";
import { buildCalculatorSchemaGraph, buildSocialMetadata } from "@/lib/seo-schema";

function formatCNAEPonto(codigoLimpo: string): string {
  return codigoLimpo.replace(/^(\d{2})(\d{2})(\d)(\d{2})$/, "$1.$2-$3-$4");
}

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

  const codigoPonto = formatCNAEPonto(cnae.codigoLimpo);

  return buildSocialMetadata({
    title: `CNAE ${cnae.codigo} (${codigoPonto} — ${cnae.nomePopular}): Anexo ${cnae.anexo}, ${
      cnae.fatorR
        ? "6% no Fator R"
        : `${(cnae.aliquotaInicialNominal * 100).toFixed(1)}%`
    } e MEI 2026`,
    description: `CNAE ${cnae.codigo} (${codigoPonto} / ${cnae.codigoLimpo} — ${cnae.titulo}) no Simples Nacional 2026: ${
      cnae.permiteMEI ? "pode ser MEI" : "não permite MEI (abre como ME)"
    }, Anexo ${cnae.anexo} (${
      cnae.fatorR
        ? "cai de 15,5% para 6% com Fator R"
        : `inicia em ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}%`
    }) e cálculo da guia DAS.`,
    path: `/cnae/${cnae.slug}`,
  });
}

export default async function CNAEDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cnae = getCNAEBySlug(slug);
  if (!cnae) notFound();

  const codigoPonto = formatCNAEPonto(cnae.codigoLimpo);
  const dadosIBGE = await fetchCNAEFromIBGE(cnae.codigoLimpo);
  const profissoesRelacionadas = PROFISSOES_SEO.filter(
    (p) => p.cnaeRecomendadoSlug === cnae.slug
  );

  const breadcrumbs = [
    { name: "Início", path: "/" },
    { name: "Tabela CNAE 2026", path: "/cnae" },
    { name: `CNAE ${cnae.codigo}`, path: `/cnae/${cnae.slug}` },
  ];

  const faqs = [
    {
      question: `O CNAE ${cnae.codigo} (${codigoPonto}) pode ser MEI em 2026?`,
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
  ];

  const schemaGraph = buildCalculatorSchemaGraph({
    title: `Calculadora e Consulta CNAE ${cnae.codigo} (${cnae.nomePopular}) — Simples Nacional 2026`,
    description: `Simulador de imposto DAS, Fator R e enquadramento MEI para o CNAE ${cnae.codigo} (${codigoPonto} — ${cnae.titulo}) no Simples Nacional 2026.`,
    path: `/cnae/${cnae.slug}`,
    breadcrumbs,
    faqs,
  });

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <Breadcrumbs items={breadcrumbs} />

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
            <div className="flex justify-between gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-500">Código CNAE (RFB / IBGE / sem máscara)</span>
              <strong className="font-mono text-slate-900 text-right">
                {cnae.codigo} · {codigoPonto} · {cnae.codigoLimpo}
              </strong>
            </div>
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
        <p className="pt-2 border-t border-slate-100 text-xs text-slate-600">
          <strong>NFS-e Padrão Nacional (NBS e Código de Tributação Nacional):</strong> ao emitir nota fiscal em 2026 (código IBGE <span className="font-mono">{codigoPonto}</span>), o emissor municipal ou nacional vincula o CNAE ao item correspondente da Lista de Serviços (LC 116) e à Nomenclatura Brasileira de Serviços (NBS) para fins de controle da transição CBS/IBS, sem acréscimo de imposto no DAS para optantes pelo Simples Nacional.
        </p>
      </section>

      {profissoesRelacionadas.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            Comparativos CLT vs PJ para quem atua com o CNAE {cnae.codigo}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profissoesRelacionadas.map((prof) => (
              <Link
                key={prof.slug}
                href={`/clt-vs-pj/profissao/${prof.slug}`}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-700 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs sm:text-sm"
              >
                <span className="font-semibold text-slate-900">{prof.nome}</span>
                <ArrowRight className="w-4 h-4 text-blue-700 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <AdSlot
        slotId="cnae-bottom-banner"
        format="leaderboard"
        label={`Abertura de CNPJ no CNAE ${cnae.codigo}, certificado digital e-CNPJ A1 e Conta PJ`}
      />

      <PageFAQSection faqs={faqs} />

      <SnowballLinks
        currentSalary={10000}
        seedKey={cnae.slug}
        cnaeCategoria={cnae.categoria}
        currentSlug={cnae.slug}
      />
    </div>
  );
}
