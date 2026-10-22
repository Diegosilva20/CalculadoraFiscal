import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CNAES_DATA, getCNAEBySlug } from "@/data/cnaes";
import { fetchCNAEFromIBGE } from "@/lib/gov-apis";
import CNAECalculator from "@/components/CNAECalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { CheckCircle2, Info, Building2 } from "lucide-react";

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
    title: `CNAE ${cnae.codigo} (${cnae.nomePopular}): Anexo, Fator R, pode ser MEI e Imposto 2026`,
    description: `Consulta completa do CNAE ${cnae.codigo} — ${cnae.titulo} em 2026: ${
      cnae.permiteMEI ? "Permite ser MEI" : "Não pode ser MEI"
    }, tributado no Anexo ${cnae.anexo} (${
      cnae.fatorR
        ? "cai para 6% com Fator R"
        : `inicia em ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}%`
    }). Simule sua guia DAS agora!`,
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `O CNAE ${cnae.codigo} pode ser MEI em 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: cnae.permiteMEI
            ? `Sim! O CNAE ${cnae.codigo} (${cnae.titulo}) é permitido no MEI em 2026, respeitando o limite de faturamento anual de R$ 81.000.`
            : `Não. O CNAE ${cnae.codigo} (${cnae.titulo}) não é permitido no MEI por se tratar de atividade intelectual ou regulamentada, devendo ser aberto como Microempresa (ME / SLU) no Simples Nacional.`,
        },
      },
      {
        "@type": "Question",
        name: `Qual o Anexo do Simples Nacional e alíquota do CNAE ${cnae.codigo}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: cnae.fatorR
            ? `O CNAE ${cnae.codigo} pertence originalmente ao Anexo V (15,5%), mas está sujeito ao Fator R. Mantendo 28% de folha/pró-labore, ele é tributado pelo Anexo III com alíquota inicial de apenas 6%.`
            : `O CNAE ${cnae.codigo} é tributado diretamente no Anexo ${cnae.anexo} do Simples Nacional, com alíquota nominal inicial de ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}% sem exigir Fator R.`,
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

      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">
          Início
        </Link>
        <span>/</span>
        <Link href="/cnae" className="hover:text-blue-600">
          Tabela CNAE 2026
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">CNAE {cnae.codigo}</span>
      </nav>

      {/* Ficha Técnica Rápida do CNAE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
            {cnae.categoria}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono">
            Anexo {cnae.anexo} • Inicial {(cnae.aliquotaInicialNominal * 100).toFixed(1)}%
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded ${
              cnae.permiteMEI
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {cnae.permiteMEI ? "✅ Pode ser MEI em 2026" : "❌ Não permite MEI (Abrir ME)"}
          </span>
          {cnae.fatorR && (
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900">
              ⚡ Tem Fator R (Cai para 6% no Anexo III)
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          CNAE {cnae.codigo} — {cnae.titulo} ({cnae.nomePopular})
        </h1>

        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-sm text-slate-800">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-blue-950 mb-0.5">
              Recomendação Prática de Contabilidade (2026):
            </strong>
            {cnae.dicaTributaria2026}
          </div>
        </div>
      </div>

      {/* Calculadora Interativa exclusiva para este CNAE */}
      <CNAECalculator
        codigoCNAE={cnae.codigo}
        tituloCNAE={cnae.titulo}
        anexoPadrao={cnae.anexo}
        sujeitoFatorR={cnae.fatorR}
        permiteMEI={cnae.permiteMEI}
        reducaoIVA2026={cnae.reducaoIVA2026}
      />

      {/* O que este CNAE compreende + Resumo Tributário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">
            O que você pode faturar na Nota Fiscal com o CNAE {cnae.codigo}
          </h2>
          <ul className="space-y-3 text-sm text-slate-700">
            {cnae.atividadesCompreendidas.map((ativ, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>{ativ}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Ficha Tributária {cnae.codigo} em 2026
          </h2>
          <div className="text-xs sm:text-sm space-y-2.5 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Permite enquadramento MEI?</span>
              <strong className="text-slate-900">
                {cnae.permiteMEI ? "Sim (até R$ 81.000/ano)" : "Não (Exige Microempresa ME)"}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Anexo Padrão Simples Nacional</span>
              <strong className="text-slate-900">Anexo {cnae.anexo}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Sujeito ao Fator R (28%)?</span>
              <strong className="text-emerald-700">
                {cnae.fatorR ? "Sim (Reduz para 6% no Anexo III)" : "Não precisa (Direto no Anexo)"}
              </strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Redução Reforma Tributária (CBS/IBS)</span>
              <strong className="text-blue-700">
                {(cnae.reducaoIVA2026 * 100).toFixed(0)}% de redução na alíquota IVA
              </strong>
            </div>
            {dadosIBGE && (
              <div className="pt-3 mt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">
                  🏛️ Classificação Oficial API IBGE (CONCLA):
                </span>
                <span>
                  {dadosIBGE.secao} {dadosIBGE.divisao ? `• ${dadosIBGE.divisao}` : ""}
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Checklist Prático de Abertura de CNPJ (Humanizado + Alto CPC Bancário/Contábil) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          Guia de Abertura de Empresa & Emissão de Nota Fiscal (2026)
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Como abrir um CNPJ com o CNAE {cnae.codigo} pagando o menor imposto legal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <strong className="text-slate-900 block">
              1. Natureza Jurídica (SLU) e Contabilidade Digital
            </strong>
            <p>
              {cnae.permiteMEI
                ? "Se você fatura até R$ 6.750/mês e não tem sócio, pode abrir um MEI gratuitamente no Portal do Empreendedor em 5 minutos. Passando desse teto, migre para uma SLU (Sociedade Limitada Unipessoal) com auxílio de uma contabilidade digital."
                : "Como este CNAE não aceita MEI, a melhor estrutura jurídica para atuar sozinho é a SLU (Sociedade Limitada Unipessoal): ela separa o seu CPF do patrimônio do CNPJ e pode ser aberta sem custo de honorários em escritórios de contabilidade online."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <strong className="text-slate-900 block">
              2. Certificado Digital e-CNPJ A1 e Emissor NFS-e
            </strong>
            <p>
              Para emitir a Nota Fiscal de Serviços Eletrônica (NFS-e Padrão Nacional 2026) e assinar declarações no e-CAC da Receita Federal, adquira um <strong>Certificado Digital e-CNPJ arquivo A1</strong> (válido por 12 meses) e vincule-o ao sistema emissor da sua contabilidade ou ERP.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <strong className="text-slate-900 block">
              3. Conta Digital PJ Gratuita e Cartão Empresarial
            </strong>
            <p>
              Assim que o cartão CNPJ sair, abra uma <strong>conta digital PJ isenta de tarifas</strong> (Pix PJ ilimitado, emissão de boletos e pagamento automático da guia DAS). Isso comprova a separação contábil e garante que todo o lucro distribuído vá para a sua conta pessoal <strong>100% isento de Imposto de Renda</strong>.
            </p>
          </div>
        </div>
      </section>

      <AdSlot
        slotId="cnae-bottom-banner"
        format="leaderboard"
        label={`Emita Notas Fiscais no CNAE ${cnae.codigo} com Conta PJ Integrada e Fator R Automatizado`}
      />

      <SnowballLinks currentSalary={10000} />
    </div>
  );
}
