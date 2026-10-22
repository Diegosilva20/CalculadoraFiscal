import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, FileSpreadsheet, Briefcase } from "lucide-react";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import { CNAES_DATA } from "@/data/cnaes";

/**
 * Componente "Estratégia Bola de Neve":
 * Mantém o usuário navegando entre 3 a 5 páginas na mesma sessão (multiplicando o RPM do AdSense)
 * e distribui autoridade de links internos (Internal Link Juice) para todas as páginas programáticas.
 */
export default function SnowballLinks({
  currentSalary = 8000,
}: {
  currentSalary?: number;
}) {
  // Seleciona salários vizinhos para o usuário clicar com 1 toque
  const nearbySalaries = FAIXAS_SALARIAIS_SEO.filter(
    (s) => Math.abs(s - currentSalary) <= 4000 && s !== currentSalary
  ).slice(0, 6);

  return (
    <section className="mt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4" />
        Próximos Passos Recomendados (Simulações Rápidas 2026)
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        Continue simulando para tomar a melhor decisão financeira
      </h2>

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

        {/* Coluna 2: Profissões em Alta */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-300 mb-3">
            <Briefcase className="w-4 h-4" />
            CLT vs PJ por Profissão
          </div>
          <ul className="space-y-2 text-xs">
            {PROFISSOES_SEO.slice(0, 4).map((prof) => (
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

        {/* Coluna 3: CNAEs com Fator R (Economia de Imposto) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-amber-300 mb-3">
            <FileSpreadsheet className="w-4 h-4" />
            CNAEs para Pagar só 6% no PJ
          </div>
          <ul className="space-y-2 text-xs">
            {CNAES_DATA.slice(0, 4).map((cnae) => (
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
