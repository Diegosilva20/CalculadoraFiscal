import React from "react";
import Link from "next/link";
import { FAIXAS_SALARIAIS_SEO } from "@/data/profissoes";
import { CNAES_DATA } from "@/data/cnaes";
import CookiePreferencesButton from "./CookiePreferencesButton";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 mt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-slate-900 font-extrabold text-base mb-2.5">
              Calcula<span className="text-blue-700">Fiscal</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Portal independente de calculadoras trabalhistas, tributárias e financeiras atualizado com as tabelas de 2026 de INSS, IRPF, Simples Nacional, Fator R e transição CBS/IBS.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-3 uppercase tracking-wider">
              Calculadoras
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/clt-vs-pj" className="hover:text-blue-700 transition-colors">
                  Comparador CLT vs PJ 2026
                </Link>
              </li>
              <li>
                <Link href="/cnae" className="hover:text-blue-700 transition-colors">
                  Tabela CNAE e Simples Nacional
                </Link>
              </li>
              <li>
                <Link href="/calculadora-fator-r" className="hover:text-blue-700 transition-colors">
                  Calculadora de Fator R (28%)
                </Link>
              </li>
              <li>
                <Link href="/calculadora-salario-liquido" className="hover:text-blue-700 transition-colors">
                  Calculadora de Salário Líquido
                </Link>
              </li>
              <li>
                <Link href="/custo-funcionario-clt" className="hover:text-blue-700 transition-colors">
                  Custo de Funcionário CLT
                </Link>
              </li>
              <li>
                <Link href="/calculadora-rescisao" className="hover:text-blue-700 transition-colors">
                  Rescisão Trabalhista e Férias
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-3 uppercase tracking-wider">
              Simulações por Salário
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FAIXAS_SALARIAIS_SEO.slice(0, 12).map((sal) => (
                <Link
                  key={sal}
                  href={`/clt-vs-pj/salario/${sal}`}
                  className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  R$ {sal.toLocaleString("pt-BR")}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-3 uppercase tracking-wider">
              CNAEs Frequentes
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CNAES_DATA.slice(0, 6).map((cnae) => (
                <li key={cnae.codigoLimpo}>
                  <Link
                    href={`/cnae/${cnae.slug}`}
                    className="hover:text-blue-700 transition-colors line-clamp-1"
                  >
                    {cnae.codigo} · {cnae.nomePopular}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © 2026 CalculaFiscal. Valores com finalidade simulatória e informativa; não substituem conferência contábil formal.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/sobre" className="hover:text-slate-900">
              Sobre e Metodologia
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-slate-900">
              Privacidade (LGPD)
            </Link>
            <Link href="/termos-de-uso" className="hover:text-slate-900">
              Termos de Uso
            </Link>
            <Link href="/contato" className="hover:text-slate-900">
              Contato
            </Link>
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
