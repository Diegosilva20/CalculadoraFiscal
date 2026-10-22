import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { FAIXAS_SALARIAIS_SEO } from "@/data/profissoes";
import { calculateCLTvsPJ, formatBRL, formatPercent } from "@/lib/calculators";

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
    description: `Ganhar R$ ${salario.toLocaleString("pt-BR")} CLT deixa ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos na conta. Para compensar como PJ no Simples Nacional em 2026, sua nota fiscal deve partir de ${formatBRL(sim.faturamentoPJEquivalente)}.`,
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quanto sobra líquido de um salário de R$ ${salario.toLocaleString("pt-BR")} CLT em 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Em 2026, um salário bruto de ${formatBRL(salario)} na carteira assinada tem desconto de ${formatBRL(sim.clt.inss)} de INSS e ${formatBRL(sim.clt.irpf)} de Imposto de Renda Retido na Fonte (IRRF), deixando ${formatBRL(sim.clt.salarioLiquidoMensal)} líquidos por mês.`,
        },
      },
      {
        "@type": "Question",
        name: `R$ ${salario.toLocaleString("pt-BR")} CLT equivale a quanto como PJ em 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Somando salário líquido (${formatBRL(sim.clt.salarioLiquidoMensal)}), depósito mensal de FGTS (${formatBRL(sim.clt.fgtsMensal)}), 13º proporcional, férias + 1/3 e benefícios, o pacote CLT entrega ${formatBRL(sim.clt.pacoteTotalMensalReal)}/mês. Para empatar atuando com CNPJ no Simples Nacional (Anexo III com 6% de imposto inicial), você precisa emitir nota fiscal de no mínimo ${formatBRL(sim.faturamentoPJEquivalente)} mensais.`,
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

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">
          Início
        </Link>
        <span>/</span>
        <Link href="/clt-vs-pj" className="hover:text-blue-600">
          CLT vs PJ 2026
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">
          R$ {salario.toLocaleString("pt-BR")} CLT vs PJ
        </span>
      </nav>

      {/* Cabeçalho Direto ao Ponto */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800">
          Comparativo Real de Bolso • Tabelas 2026
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Salário de R$ {salario.toLocaleString("pt-BR")} CLT equivale a quanto PJ em 2026?
        </h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Um salário bruto de <strong>{formatBRL(salario)} na CLT</strong> coloca{" "}
          <strong className="text-blue-700">
            {formatBRL(sim.clt.salarioLiquidoMensal)} líquidos na sua conta
          </strong>{" "}
          todo mês. Mas o erro mais comum ao negociar uma vaga PJ é esquecer do que fica oculto no holerite: a empresa deposita{" "}
          <strong>{formatBRL(sim.clt.fgtsMensal)}/mês de FGTS</strong>, além de pagar seu 13º salário ({formatBRL(sim.clt.provisao13LiquidoMensal)}/mês diluído), 1/3 de férias e vale-refeição/plano de saúde. Colocando tudo na ponta do lápis, sua vaga CLT vale{" "}
          <strong>{formatBRL(sim.clt.pacoteTotalMensalReal)} por mês</strong>. Para não perder dinheiro ao abrir um CNPJ no Simples Nacional, peça a partir de{" "}
          <strong className="text-emerald-700 underline">
            {formatBRL(sim.faturamentoPJEquivalente)}/mês na Nota Fiscal
          </strong>.
        </p>
      </div>

      <AdSlot
        slotId="salario-seo-top"
        format="leaderboard"
        label={`Vai emitir nota de ${formatBRL(sim.faturamentoPJEquivalente)}? Abra seu CNPJ grátis em Contabilidade Digital com Conta PJ inclusa`}
      />

      {/* Calculadora pré-carregada com o salário da URL */}
      <CLTvsPJCalculator
        initialSalarioCLT={salario}
        initialFaturamentoPJ={pjSugerido}
      />

      {/* Guia Prático Humanizado + Palavras-Chave de Alto CPC Bancário/Contábil */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Análise de Contador: O que muda no seu bolso ao trocar R$ {salario.toLocaleString("pt-BR")} CLT por CNPJ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              1. Contabilidade Digital e Fator R (6%)
            </h3>
            <p>
              Se a sua atividade entra no Anexo V do Simples Nacional (como TI, engenharia, medicina ou consultoria), nunca pague os 15,5% cheios. Usando uma <strong>contabilidade digital online</strong> para configurar seu pró-labore em 28% do faturamento (Fator R), sua guia DAS cai para <strong>6% no Anexo III</strong>, gerando uma economia de{" "}
              <strong className="text-emerald-700">
                {formatBRL(sim.pj.economiaMensalComFatorR * 12)} por ano
              </strong>.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              2. Plano de Saúde Empresarial pelo CNPJ
            </h3>
            <p>
              Quem sai da CLT costuma se assustar com o preço de um plano de saúde individual. O segredo é contratar um <strong>plano de saúde empresarial por CNPJ (PME)</strong> (a partir de 2 vidas, incluindo um dependente ou sócio): as tabelas empresariais de operadoras como Bradesco Saúde, SulAmérica e Amil custam de <strong>30% a 40% menos</strong> que na pessoa física e podem ser pagas pela conta da empresa.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">
              3. Conta Digital PJ Isenta e Reserva CDI
            </h3>
            <p>
              Pela regra contábil, você não deve misturar gastos pessoais com o dinheiro da empresa. Abra uma <strong>conta digital PJ gratuita sem tarifa de manutenção</strong> (como BTG Empresas, Cora, Inter PJ ou Itaú Empresas), pague a guia DAS e o pró-labore no dia 20, e transfira o lucro líquido isento de Imposto de Renda ({formatBRL(sim.pj.lucroLiquidoIsento)}) para a sua pessoa física, separando 10% em um <strong>CDB de liquidez diária 100% CDI</strong> para substituir o antigo FGTS.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 pt-2">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <h3 className="font-bold text-slate-900 mb-1">
              Qual o desconto exato de INSS e Imposto de Renda para R$ {salario.toLocaleString("pt-BR")} CLT em 2026?
            </h3>
            <p>
              No contracheque de 2026, o INSS progressivo retém{" "}
              <strong>{formatBRL(sim.clt.inss)}</strong> e o Imposto de Renda (IRRF) retém{" "}
              <strong>{formatBRL(sim.clt.irpf)}</strong> (aplicando automaticamente o desconto{" "}
              {sim.clt.metodoIR}). Se você possui gastos altos com plano de saúde, escola de filhos ou aplica até 12% da renda bruta em <strong>Previdência Privada PGBL</strong>, pode restituir boa parte desse IRRF na Declaração Anual.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <h3 className="font-bold text-slate-900 mb-1">
              Faturando {formatBRL(pjSugerido)} como PJ, preciso de Microempresa (ME) ou posso ser MEI?
            </h3>
            <p>
              Com faturamento mensal de {formatBRL(pjSugerido)} ({formatBRL(pjSugerido * 12)}/ano),{" "}
              {pjSugerido * 12 <= 81000
                ? "você ainda está dentro do teto anual de R$ 81.000 do MEI caso a sua profissão seja permitida na lista de atividades do Microempreendedor Individual."
                : "você ultrapassa o limite anual de R$ 81.000 do MEI, sendo necessário abrir uma Sociedade Limitada Unipessoal (SLU) enquadrada como Microempresa (ME) no Simples Nacional, emitindo nota com Certificado Digital e-CNPJ."}
            </p>
          </div>
        </div>
      </section>

      <SnowballLinks currentSalary={salario} />
    </div>
  );
}
