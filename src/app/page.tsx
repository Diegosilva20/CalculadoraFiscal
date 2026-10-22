import React from "react";
import Link from "next/link";
import CLTvsPJCalculator from "@/components/CLTvsPJCalculator";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { CNAES_DATA } from "@/data/cnaes";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calculator,
  CheckCircle2,
  FileSpreadsheet,
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="bg-slate-950 bg-fintech-grid text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Atualizado com a Isenção IRPF R$ 5.000 e Reforma Tributária (CBS/IBS 2026)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Descubra quanto sobra no seu bolso em{" "}
            <span className="text-emerald-400">2026: CLT ou PJ?</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Compare propostas CLT vs. CNPJ até o último centavo, consulte a alíquota exata de qualquer{" "}
            <strong className="text-white">CNAE no Simples Nacional com Fator R (6%)</strong> e veja o impacto real da Reforma Tributária na sua profissão.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-slate-300">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tabela INSS e IRRF 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Cálculo Automático de Fator R (28%)
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Simulador IVA Dual (CBS + IBS)
            </span>
          </div>
        </div>
      </section>

      {/* Top Leaderboard AdSense */}
      <AdSlot
        slotId="home-top-leaderboard"
        format="leaderboard"
        label="Banner Topo • Abra sua Empresa PJ Grátis ou Mude de Contador em 5 Minutos"
        estimatedCpc="CPC Médio: R$ 4,50 (Contabilidade Digital / Bancos PJ)"
      />

      {/* Calculadora Principal Interativa já na Home (Retenção Imediata) */}
      <section aria-labelledby="calc-principal">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              id="calc-principal"
              className="text-2xl font-extrabold text-slate-900"
            >
              Simulador Interativo CLT vs PJ 2026
            </h2>
            <p className="text-sm text-slate-600">
              Ajuste os controles abaixo para descobrir o ponto de equilíbrio exato entre carteira assinada e CNPJ.
            </p>
          </div>
          <Link
            href="/clt-vs-pj"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
          >
            Ver guia completo CLT vs PJ
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CLTvsPJCalculator initialSalarioCLT={8000} initialFaturamentoPJ={12000} />
      </section>

      {/* Os 3 Motores do Portal (Links para páginas internas) */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Hub Completo de Ferramentas Fiscais & Trabalhistas
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Escolha sua Calculadora Especializada 2026
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/clt-vs-pj"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600">
                Comparador CLT vs PJ
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Compare salário líquido, FGTS, 13º, férias e benefícios contra Simples Nacional e descubra quanto pedir como PJ.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
              Acessar Simulador <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/cnae"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600">
                Tabela CNAE & Reforma 2026
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Consulte se o seu CNAE pode ser MEI, qual o Anexo do Simples (I, III, IV ou V) e simule o desconto do IVA Dual.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              Consultar CNAEs <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculadora-fator-r"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-600">
                Calculadora de Fator R (28%)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Descubra o pró-labore exato para tirar sua empresa do Anexo V (15,5%) e pagar apenas 6% no Anexo III sem IRPF até R$ 5 mil.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-600">
              Calcular Fator R <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculadora-salario-liquido"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600">
                Salário Líquido 2026
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Cálculo atualizado com a nova isenção de Imposto de Renda até R$ 5.000, redutor até R$ 7.000 e INSS progressivo.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
              Calcular Líquido <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/custo-funcionario-clt"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600">
                Custo de Funcionário CLT
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Simulador para empresas (Simples Nacional, MEI e Lucro Presumido): veja o custo real com FGTS, 13º, férias e INSS Patronal.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600">
              Simular Contratação <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculadora-rescisao"
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600">
                Rescisão & Férias CLT
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Vai sair da CLT para virar PJ? Calcule exatamente seu acerto rescisório, multa de 40% do FGTS, aviso prévio e férias.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-600">
              Calcular Acerto <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Diretório Programático 1: Simulações Prontas por Salário */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Tabelas Prontas: Quanto um Salário CLT equivale como PJ em 2026?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6">
          Clique no valor do seu salário atual (ou proposta recebida) para abrir o estudo completo de viabilidade, impostos e ponto de equilíbrio:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {FAIXAS_SALARIAIS_SEO.map((valor) => (
            <Link
              key={valor}
              href={`/clt-vs-pj/salario/${valor}`}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all text-center group"
            >
              <span className="block text-[11px] text-slate-500">Salário CLT</span>
              <span className="block text-sm font-extrabold text-slate-900 group-hover:text-blue-700">
                R$ {valor.toLocaleString("pt-BR")}
              </span>
              <span className="block text-[10px] font-semibold text-blue-600 mt-0.5">
                Ver equivalente PJ →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Diretório Programático 2: CLT vs PJ por Profissão e CNAEs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">
            Simuladores CLT vs PJ por Profissão
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Com CNAE específico, Anexo do Simples Nacional e Fator R configurados:
          </p>
          <div className="divide-y divide-slate-100">
            {PROFISSOES_SEO.map((prof) => (
              <Link
                key={prof.slug}
                href={`/clt-vs-pj/profissao/${prof.slug}`}
                className="py-2.5 flex items-center justify-between text-xs sm:text-sm hover:text-blue-600 transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-800 block">
                    {prof.nome}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    CNAE {prof.cnaeRecomendadoCodigo} • Anexo {prof.anexoPadrao}
                    {prof.sujeitoFatorR ? " (6% c/ Fator R)" : ""}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">
            CNAEs Mais Buscados no Simples Nacional 2026
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Verifique alíquota inicial, permissão MEI e redução do IVA Dual:
          </p>
          <div className="divide-y divide-slate-100">
            {CNAES_DATA.slice(0, 10).map((cnae) => (
              <Link
                key={cnae.codigoLimpo}
                href={`/cnae/${cnae.slug}`}
                className="py-2.5 flex items-center justify-between text-xs sm:text-sm hover:text-emerald-700 transition-colors"
              >
                <div className="pr-3">
                  <span className="font-bold text-slate-800 block">
                    CNAE {cnae.codigo} — {cnae.nomePopular}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Anexo {cnae.anexo} •{" "}
                    {cnae.fatorR ? "Cai p/ 6% com Fator R" : `Inicia em ${(cnae.aliquotaInicialNominal * 100).toFixed(1)}%`} •{" "}
                    {cnae.permiteMEI ? "✅ Permite MEI" : "❌ Não pode MEI"}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <SnowballLinks currentSalary={8000} />
    </div>
  );
}
