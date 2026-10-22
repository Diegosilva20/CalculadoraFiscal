import React from "react";
import Link from "next/link";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO } from "@/data/profissoes";
import { CNAES_DATA } from "@/data/cnaes";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              Calcula<span className="text-blue-400">Fiscal</span> 2026
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Portal independente de simuladores trabalhistas, tributários e financeiros atualizados com a nova tabela de isenção de IRPF até R$ 5.000, Fator R do Simples Nacional e Reforma Tributária (CBS/IBS 2026).
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Calculadoras Principais
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/clt-vs-pj" className="hover:text-white transition-colors">
                  Simulador CLT vs PJ 2026
                </Link>
              </li>
              <li>
                <Link href="/cnae" className="hover:text-white transition-colors">
                  Tabela CNAE, Fator R e Reforma 2026
                </Link>
              </li>
              <li>
                <Link href="/calculadora-fator-r" className="hover:text-white transition-colors">
                  Calculadora de Fator R (28% • Anexo III)
                </Link>
              </li>
              <li>
                <Link href="/calculadora-salario-liquido" className="hover:text-white transition-colors">
                  Calculadora de Salário Líquido 2026
                </Link>
              </li>
              <li>
                <Link href="/custo-funcionario-clt" className="hover:text-white transition-colors">
                  Calculadora Custo de Funcionário CLT
                </Link>
              </li>
              <li>
                <Link href="/calculadora-rescisao" className="hover:text-white transition-colors">
                  Calculadora de Rescisão e Férias CLT
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Simulações por Salário (SEO)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FAIXAS_SALARIAIS_SEO.slice(0, 12).map((sal) => (
                <Link
                  key={sal}
                  href={`/clt-vs-pj/salario/${sal}`}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  R$ {sal.toLocaleString("pt-BR")} CLT vs PJ
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              CNAEs Mais Consultados
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CNAES_DATA.slice(0, 6).map((cnae) => (
                <li key={cnae.codigoLimpo}>
                  <Link
                    href={`/cnae/${cnae.slug}`}
                    className="hover:text-white transition-colors line-clamp-1"
                  >
                    CNAE {cnae.codigo} — {cnae.nomePopular}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © 2026 CalculaFiscal Brasil. Os cálculos têm caráter educativo e simulatório e não substituem a consultoria contábil formal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sobre" className="hover:text-slate-300">
              Sobre & Metodologia
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-slate-300">
              Política de Privacidade (LGPD)
            </Link>
            <Link href="/termos-de-uso" className="hover:text-slate-300">
              Termos de Uso
            </Link>
            <Link href="/contato" className="hover:text-slate-300">
              Contato
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300">
              Sitemap XML
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
