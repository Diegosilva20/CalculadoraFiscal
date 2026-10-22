import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  Briefcase,
  Calculator,
} from "lucide-react";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import { CNAES_DATA } from "@/data/cnaes";

/**
 * Componente "Estratégia Bola de Neve" (Padrão Programmatic SEO Hub & Spoke):
 * - Mantém o usuário navegando entre 3 a 5 páginas na mesma sessão (multiplicando o RPM do AdSense)
 * - Usa rotação determinística baseada em `currentSalary` para distribuir Link Juice interno
 *   para TODAS as 24 profissões, os 47 CNAEs, as 45 faixas salariais e as 6 calculadoras principais.
 */
export default function SnowballLinks({
  currentSalary = 8000,
}: {
  currentSalary?: number;
}) {
  // Seleciona salários vizinhos para o usuário clicar com 1 toque
  const nearbySalaries = FAIXAS_SALARIAIS_SEO.filter(
    (s) => Math.abs(s - currentSalary) <= 4500 && s !== currentSalary
  ).slice(0, 6);

  // Semente determinística (SSR-safe) para rotacionar profissões e CNAEs entre as páginas
  const seed = Math.abs(Math.round(currentSalary / 500));

  const rotatedProfissoes = Array.from({ length: 5 }, (_, idx) => {
    const pos = (seed * 3 + idx) % PROFISSOES_SEO.length;
    return PROFISSOES_SEO[pos];
  });

  const rotatedCnaes = Array.from({ length: 5 }, (_, idx) => {
    const pos = (seed * 5 + idx) % CNAES_DATA.length;
    return CNAES_DATA[pos];
  });

  const mainCalculators = [
    { name: "CLT vs PJ 2026", href: "/clt-vs-pj" },
    { name: "Calculadora Fator R (6%)", href: "/calculadora-fator-r" },
    { name: "Custo Funcionário CLT", href: "/custo-funcionario-clt" },
    { name: "Tabela CNAE 2026", href: "/cnae" },
    { name: "Salário Líquido (IR 5 mil)", href: "/calculadora-salario-liquido" },
    { name: "Rescisão e Férias CLT", href: "/calculadora-rescisao" },
  ];

  return (
    <section className="mt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Próximos Passos Recomendados (Simulações Rápidas 2026)
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Continue simulando para tomar a melhor decisão financeira
        </h2>
      </div>

      {/* Atalhos para as 6 Calculadoras Principais (Hub Reinforcement) */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-slate-300 mb-3">
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          Ferramentas Oficiais CalculaFiscal 2026
        </div>
        <div className="flex flex-wrap gap-2">
          {mainCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="text-xs font-medium bg-white/10 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{calc.name}</span>
              <ArrowRight className="w-3 h-3 opacity-75" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna 1: Salários Próximos */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-blue-300 mb-3">
            <TrendingUp className="w-4 h-4" />
            Compare Outras Faixas Salariais
          </div>
          <div className="grid grid-cols-2 gap-2">
            {nearbySalaries.map((sal) => (
              <Link
                key={sal}
                href={`/clt-vs-pj/salario/${sal}`}
                className="text-xs bg-white/10 hover:bg-blue-600 px-3 py-2 rounded-lg flex items-center justify-between transition-colors"
              >
                <span>R$ {sal.toLocaleString("pt-BR")}</span>
                <ArrowRight className="w-3 h-3 opacity-70" />
              </Link>
            ))}
          </div>
        </div>

        {/* Coluna 2: Profissões Rotativas (Distribuição Total de Link Juice) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-300 mb-3">
            <Briefcase className="w-4 h-4" />
            CLT vs PJ por Profissão
          </div>
          <ul className="space-y-2 text-xs">
            {rotatedProfissoes.map((prof) => (
              <li key={prof.slug}>
                <Link
                  href={`/clt-vs-pj/profissao/${prof.slug}`}
                  className="hover:text-emerald-300 flex items-center justify-between py-1 border-b border-white/10 transition-colors"
                >
                  <span className="truncate">{prof.nome}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: CNAEs Rotativos (Cobertura Completa da Tabela CNAE) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-amber-300 mb-3">
            <FileSpreadsheet className="w-4 h-4" />
            Consulta de CNAEs e Fator R
          </div>
          <ul className="space-y-2 text-xs">
            {rotatedCnaes.map((cnae) => (
              <li key={cnae.codigoLimpo}>
                <Link
                  href={`/cnae/${cnae.slug}`}
                  className="hover:text-amber-300 flex items-center justify-between py-1 border-b border-white/10 transition-colors"
                >
                  <span className="truncate">
                    <strong>{cnae.codigo}</strong> • {cnae.nomePopular}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
