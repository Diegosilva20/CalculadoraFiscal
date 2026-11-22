import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import { CNAES_DATA } from "@/data/cnaes";

/**
 * Malha de navegação cruzada interna ("Hub & Spoke") com visual editorial limpo.
 * Distribui links para todas as calculadoras, faixas salariais, profissões e CNAEs.
 */
export default function SnowballLinks({
  currentSalary = 8000,
}: {
  currentSalary?: number;
}) {
  const nearbySalaries = FAIXAS_SALARIAIS_SEO.filter(
    (s) => Math.abs(s - currentSalary) <= 4500 && s !== currentSalary
  ).slice(0, 6);

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
    { name: "Calculadora de Fator R (6%)", href: "/calculadora-fator-r" },
    { name: "Custo de Funcionário CLT", href: "/custo-funcionario-clt" },
    { name: "Tabela CNAE 2026", href: "/cnae" },
    { name: "Salário Líquido 2026", href: "/calculadora-salario-liquido" },
    { name: "Rescisão e Férias CLT", href: "/calculadora-rescisao" },
  ];

  return (
    <section className="mt-10 bg-white border border-slate-200 border-t-2 border-t-slate-900 rounded-xl p-6 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Outras ferramentas e comparativos 2026
          </h2>
          <p className="text-xs text-slate-500">
            Consulte faixas salariais vizinhas, profissões ou códigos CNAE do Simples Nacional.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {mainCalculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="text-xs font-semibold bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{calc.name}</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Faixas Salariais CLT vs PJ
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {nearbySalaries.map((sal) => (
              <Link
                key={sal}
                href={`/clt-vs-pj/salario/${sal}`}
                className="text-xs font-medium bg-slate-50 border border-slate-200 hover:border-blue-600 hover:text-blue-700 text-slate-800 px-3 py-2 rounded-lg flex items-center justify-between transition-colors"
              >
                <span className="font-mono">R$ {sal.toLocaleString("pt-BR")}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Simuladores por Profissão
          </h3>
          <ul className="divide-y divide-slate-100 text-xs">
            {rotatedProfissoes.map((prof) => (
              <li key={prof.slug}>
                <Link
                  href={`/clt-vs-pj/profissao/${prof.slug}`}
                  className="text-slate-700 hover:text-blue-700 flex items-center justify-between py-2 transition-colors"
                >
                  <span className="truncate font-medium">{prof.nome}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Consulta de CNAEs e Fator R
          </h3>
          <ul className="divide-y divide-slate-100 text-xs">
            {rotatedCnaes.map((cnae) => (
              <li key={cnae.codigoLimpo}>
                <Link
                  href={`/cnae/${cnae.slug}`}
                  className="text-slate-700 hover:text-blue-700 flex items-center justify-between py-2 transition-colors"
                >
                  <span className="truncate">
                    <strong className="font-mono text-slate-900">{cnae.codigo}</strong>{" "}
                    · {cnae.nomePopular}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
