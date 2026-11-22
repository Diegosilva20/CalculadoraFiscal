import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { CNAES_DATA } from "@/data/cnaes";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileSpreadsheet,
  Gauge,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const HOME_FAQS = [
  {
    question: "Como funciona a comparação entre salário CLT e proposta PJ em 2026?",
    answer:
      "A simulação compara o salário líquido mensal na carteira assinada e o pacote anual de direitos trabalhistas (FGTS de 8%, 13º salário, adicional de 1/3 de férias e benefícios) contra o lucro líquido de uma empresa no Simples Nacional após descontar DAS, INSS sobre pró-labore, IRRF e contabilidade.",
  },
  {
    question: "Quando vale a pena usar o Fator R no Simples Nacional?",
    answer:
      "Atividades intelectuais enquadradas no Anexo V (a partir de 15,5%) podem migrar para o Anexo III (a partir de 6%) quando a soma da folha de salários e pró-labore dos últimos 12 meses atinge pelo menos 28% da receita bruta acumulada (RBT12).",
  },
  {
    question: "Qual a regra de isenção de Imposto de Renda no salário em 2026?",
    answer:
      "Pela Lei nº 15.270/2025 vigente em 2026, rendimentos tributáveis mensais até R$ 5.000,00 possuem isenção total de IRRF, com redutor gradual decrescente até R$ 7.350,00 (978,62 − 0,133145 × rendimento) e aplicação da tabela progressiva padrão acima dessa faixa.",
  },
];

export default function HomePage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "CalculaFiscal 2026 — Calculadora CLT vs PJ, Tabela CNAE e Salário Líquido",
    description:
      "Portal brasileiro de simuladores trabalhistas e tributários atualizados para 2026: CLT vs PJ, Tabela CNAE, Fator R 28%, Custo de Funcionário CLT, Salário Líquido e Rescisão.",
    path: "/",
    breadcrumbs: [{ name: "Início", path: "/" }],
    faqs: HOME_FAQS,
  });

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* Cabeçalho Editorial Direto */}
      <section className="bg-white border border-slate-200 border-t-4 border-t-slate-900 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Tabelas 2026 · INSS, IRPF até R$ 5 mil, Simples Nacional e CBS/IBS
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Calculadora CLT vs PJ, Tabela CNAE e Simulador Tributário 2026
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Compare remuneração em carteira assinada e contratação como Pessoa Jurídica considerando descontos oficiais, FGTS, 13º, férias, alíquota efetiva do Simples Nacional, Fator R de 28% e transição da Reforma Tributária.
          </p>
        </div>
      </section>

      <AdSlot
        slotId="home-top-leaderboard"
        format="leaderboard"
        label="Abertura de CNPJ e Conta PJ gratuita para prestadores de serviço"
        estimatedCpc="CPC Médio: R$ 4,50 (Contabilidade Digital / Bancos PJ)"
      />

      {/* Simulador Principal */}
      <section aria-labelledby="calc-principal">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              id="calc-principal"
              className="text-xl font-bold text-slate-900"
            >
              Simulador comparativo CLT vs PJ
            </h2>
            <p className="text-sm text-slate-600">
              Preencha o salário bruto ou o valor da nota fiscal para apurar o ponto de equilíbrio mensal.
            </p>
          </div>
          <Link
            href="/clt-vs-pj"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
          >
            Ver tabela completa por faixa salarial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CLTvsPJCalculator initialSalarioCLT={8000} initialFaturamentoPJ={12000} />
      </section>

      {/* Grade de Calculadoras */}
      <section className="space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">
            Calculadoras e consultas fiscais
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/clt-vs-pj"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                Comparador CLT vs PJ
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Comparação entre salário líquido, FGTS, provisões trabalhistas e lucro líquido no Simples Nacional.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Abrir comparador <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/cnae"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                Tabela CNAE 2026
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Consulta de enquadramento MEI, Anexo do Simples (I, III, IV ou V), Fator R e redução no IVA Dual.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Consultar CNAEs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculadora-fator-r"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Gauge className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                Calculadora de Fator R (28%)
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Apuração de folha e pró-labore (RBT12 x FS12) para tributação pelo Anexo III em vez do Anexo V.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Calcular Fator R <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculadora-salario-liquido"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                Salário Líquido 2026
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Cálculo com INSS progressivo, isenção de IRPF até R$ 5.000 e redutor da Lei nº 15.270/2025 até R$ 7.350.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Calcular salário líquido <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/custo-funcionario-clt"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                Custo de Funcionário CLT
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Orçamento de folha para Simples Nacional, MEI e Lucro Presumido com FGTS, INSS patronal e provisões.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Simular custo empresa <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculadora-rescisao"
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                Rescisão e Férias CLT
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Estimativa de verbas rescisórias, aviso prévio proporcional, férias com 1/3 e multa do FGTS.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Calcular verbas <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Tabelas por Faixa Salarial */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900 mb-1.5">
          Simulações por faixa salarial CLT
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-5">
          Selecione uma faixa salarial para consultar o valor líquido na carteira e o faturamento mínimo equivalente no Simples Nacional:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {FAIXAS_SALARIAIS_SEO.map((valor) => (
            <Link
              key={valor}
              href={`/clt-vs-pj/salario/${valor}`}
              className="px-3 py-2.5 rounded-lg border border-slate-200 hover:border-blue-700 hover:bg-slate-50 transition-colors text-center"
            >
              <span className="block text-[11px] text-slate-500">CLT</span>
              <span className="block text-sm font-mono font-bold text-slate-900">
                R$ {valor.toLocaleString("pt-BR")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Profissões e CNAEs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            CLT vs PJ por profissão
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Cenários com média salarial, CNAE usual e regra de Fator R aplicada:
          </p>
          <div className="divide-y divide-slate-100">
            {PROFISSOES_SEO.map((prof) => (
              <Link
                key={prof.slug}
                href={`/clt-vs-pj/profissao/${prof.slug}`}
                className="py-2.5 flex items-center justify-between text-xs sm:text-sm hover:text-blue-700 transition-colors"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {prof.nome}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    CNAE {prof.cnaeRecomendadoCodigo} · Anexo {prof.anexoPadrao}
                    {prof.sujeitoFatorR ? " (6% com Fator R)" : ""}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            CNAEs mais consultados
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Enquadramento no Simples Nacional, possibilidade de MEI e desconto setorial:
          </p>
          <div className="divide-y divide-slate-100">
            {CNAES_DATA.slice(0, 10).map((cnae) => (
              <Link
                key={cnae.codigoLimpo}
                href={`/cnae/${cnae.slug}`}
                className="py-2.5 flex items-center justify-between text-xs sm:text-sm hover:text-blue-700 transition-colors"
              >
                <div className="pr-3">
                  <span className="font-semibold text-slate-900 block">
                    {cnae.codigo} · {cnae.nomePopular}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Anexo {cnae.anexo} ·{" "}
                    {cnae.fatorR
                      ? "Sujeito ao Fator R"
                      : `Inicial ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}%`}{" "}
                    · {cnae.permiteMEI ? "Aceita MEI" : "Não aceita MEI"}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Perguntas Frequentes (GEO + Schema sincronizado) */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Dúvidas frequentes sobre os cálculos de 2026
        </h2>
        <div className="divide-y divide-slate-100">
          {HOME_FAQS.map((item, idx) => (
            <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
              <h3 className="font-semibold text-sm text-slate-900 mb-1">
                {item.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SnowballLinks currentSalary={8000} />
    </div>
  );
}
