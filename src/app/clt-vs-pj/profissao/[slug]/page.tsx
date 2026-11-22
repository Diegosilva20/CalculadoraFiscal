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
    anexoPJ: prof.anexoPadrao,
    sujeitoFatorR: prof.sujeitoFatorR,
  });

  return {
    title: prof.tituloSEO,
    description: `Para ${prof.nome}, salário CLT de ${formatBRL(prof.salarioMedioCLT)} deixa ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos (pacote total ${formatBRL(sim.clt.pacoteTotalMensalReal)}). Veja quanto faturar como PJ no CNAE ${prof.cnaeRecomendadoCodigo}.`,
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
    anexoPJ: prof.anexoPadrao,
    sujeitoFatorR: prof.sujeitoFatorR,
  });

  const aliquotaEfetivaCLT =
    prof.salarioMedioCLT > 0
      ? (sim.clt.inss + sim.clt.irpf) / prof.salarioMedioCLT
      : 0;

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
        <span className="font-medium text-slate-800">{prof.nome}</span>
      </nav>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/cnae/${prof.cnaeRecomendadoSlug}`}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 hover:border-blue-700 transition-colors"
          >
            CNAE {prof.cnaeRecomendadoCodigo} · Anexo {prof.anexoPadrao}
          </Link>
          {prof.sujeitoFatorR && (
            <Link
              href="/calculadora-fator-r"
              className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Sujeito ao Fator R (Anexo III a partir de 6%)
            </Link>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {prof.tituloSEO}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {prof.resumoMercado2026} Tomando como referência um salário CLT de{" "}
          <strong>{formatBRL(prof.salarioMedioCLT)}</strong> para{" "}
          <strong>{prof.nome}</strong>, o valor líquido mensal em carteira é de{" "}
          <strong className="text-slate-900">
            {formatBRL(sim.clt.salarioLiquidoMensal)}
          </strong>{" "}
          e o pacote total chega a{" "}
          <strong className="text-slate-900">{formatBRL(sim.clt.pacoteTotalMensalReal)}/mês</strong>{" "}
          com FGTS, 13º, férias e {formatBRL(prof.beneficiosMediosCLT)} em benefícios. Em uma contratação PJ de{" "}
          <strong>{formatBRL(prof.propostaMediaPJ)}</strong>, a retirada mensal livre estimada fica em{" "}
          <strong className="text-emerald-700">
            {formatBRL(sim.pj.lucroLiquidoIsento)}
          </strong>
          , diferença anual de{" "}
          <strong>{formatBRL(sim.diferencaNoBolsoMensal * 12)}</strong>.
        </p>
      </div>

      <AdSlot
        slotId="profissao-seo-top"
        format="leaderboard"
        label={`Contabilidade para ${prof.nome} (CNAE ${prof.cnaeRecomendadoCodigo}) e monitoramento do Anexo III`}
      />

      <CLTvsPJCalculator
        initialSalarioCLT={prof.salarioMedioCLT}
        initialFaturamentoPJ={prof.propostaMediaPJ}
        initialBeneficiosCLT={prof.beneficiosMediosCLT}
        initialAnexo={prof.anexoPadrao}
        initialSujeitoFatorR={prof.sujeitoFatorR}
        profissaoNome={prof.nome}
        cnaeRecomendado={{
          codigo: prof.cnaeRecomendadoCodigo,
          slug: prof.cnaeRecomendadoSlug,
        }}
      />

      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Comparativo CLT ({formatBRL(prof.salarioMedioCLT)}) vs PJ ({formatBRL(prof.propostaMediaPJ)}) para {prof.nome}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Para igualar o pacote total da faixa CLT de {formatBRL(prof.salarioMedioCLT)}, o faturamento mínimo de equilíbrio como Pessoa Jurídica parte de{" "}
            <strong className="text-slate-900">{formatBRL(sim.faturamentoPJEquivalente)}/mês</strong>. A tabela abaixo detalha a simulação de referência:
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3.5 font-semibold">Indicador (2026)</th>
                <th className="p-3.5 font-semibold text-right">CLT ({formatBRL(prof.salarioMedioCLT)})</th>
                <th className="p-3.5 font-semibold text-right">
                  PJ ({formatBRL(prof.propostaMediaPJ)})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3.5 font-medium">Remuneração bruta / Nota Fiscal</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(prof.salarioMedioCLT)}</td>
                <td className="p-3.5 text-right font-mono font-semibold">
                  {formatBRL(prof.propostaMediaPJ)}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Tributos, INSS, IRRF e contabilidade</td>
                <td className="p-3.5 text-right font-mono text-rose-700">
                  - {formatBRL(sim.clt.inss + sim.clt.irpf)} ({formatPercent(aliquotaEfetivaCLT)})
                </td>
                <td className="p-3.5 text-right font-mono text-rose-700">
                  - {formatBRL(sim.pj.totalImpostosECustos)} ({formatPercent(sim.pj.cargaTributariaTotalPercentual)})
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Valor líquido mensal em conta</td>
                <td className="p-3.5 text-right font-mono font-semibold text-slate-900">
                  {formatBRL(sim.clt.salarioLiquidoMensal)}
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-emerald-700">
                  {formatBRL(sim.pj.lucroLiquidoIsento)}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium">Direitos e benefícios diluídos (FGTS, 13º, férias)</td>
                <td className="p-3.5 text-right font-mono text-blue-700">
                  + {formatBRL(sim.clt.pacoteTotalMensalReal - sim.clt.salarioLiquidoMensal)}
                </td>
                <td className="p-3.5 text-right font-mono text-slate-500">
                  Não se aplica
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="p-3.5">Pacote mensal efetivo</td>
                <td className="p-3.5 text-right font-mono">{formatBRL(sim.clt.pacoteTotalMensalReal)}</td>
                <td className="p-3.5 text-right font-mono text-emerald-700">
                  {formatBRL(sim.pj.lucroLiquidoIsento)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed pt-2">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              Enquadramento tributário pelo CNAE {prof.cnaeRecomendadoCodigo}
            </h3>
            <p>
              Para prestação de serviços como <strong>{prof.nome}</strong>, o código mais adotado na abertura de Sociedade Limitada Unipessoal (SLU) é o{" "}
              <Link
                href={`/cnae/${prof.cnaeRecomendadoSlug}`}
                className="text-blue-700 font-semibold underline"
              >
                CNAE {prof.cnaeRecomendadoCodigo}
              </Link>
              .{" "}
              {prof.sujeitoFatorR
                ? "Por se tratar de atividade originalmente no Anexo V (15,5%), manter o pró-labore em 28% do faturamento via contabilidade digital enquadra a empresa no Anexo III a partir de 6,0%."
                : `Este código ingressa diretamente no Anexo ${prof.anexoPadrao}, dispensando a exigência de folha de 28%.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Conta PJ e distribuição de lucros
              </h3>
              <p className="text-xs sm:text-sm">
                Centralize o recebimento das notas em uma conta digital PJ separada das despesas pessoais. Após o recolhimento do DAS e do pró-labore, a parcela restante de{" "}
                <strong>{formatBRL(sim.pj.lucroLiquidoIsento)}</strong> segue como distribuição de lucros isenta de IRPF para a pessoa física.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Cobertura de saúde e reserva financeira
              </h3>
              <p className="text-xs sm:text-sm">
                Ao abrir mão dos {formatBRL(prof.beneficiosMediosCLT)} em benefícios da carteira, considere a contratação de um plano de saúde empresarial pelo CNPJ (tabelas PME) e a formação de reserva mensal de{" "}
                {formatBRL(sim.clt.fgtsMensal + sim.clt.provisaoFeriasLiquidoMensal)} em CDB de liquidez diária para cobrir períodos de recesso.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SnowballLinks currentSalary={prof.salarioMedioCLT} seedKey={prof.slug} />
    </div>
  );
}
