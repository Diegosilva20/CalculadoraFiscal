import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Scale, AlertTriangle, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso e Isenção de Responsabilidade Contábil",
  description:
    "Termos e condições gerais de uso dos simuladores trabalhistas, tributários e financeiros do portal CalculaFiscal.",
};

export default function TermosDeUsoPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          <Scale className="w-3.5 h-3.5" />
          Termos Legais & Limitação de Responsabilidade
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Termos e Condições de Uso
        </h1>
        <p className="text-xs text-slate-500">
          Vigência: Outubro de 2026 • Portal CalculaFiscal Brasil
        </p>
      </div>

      <section className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-amber-950">
        <h2 className="text-base font-extrabold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          1. Natureza Informativa e Isenção de Consultoria Contábil ou Jurídica
        </h2>
        <p>
          Todas as calculadoras, tabelas de CNAE, comparativos CLT vs. PJ e projeções da Reforma Tributária disponibilizados no <strong>CalculaFiscal</strong> possuem <strong>caráter estritamente educativo, informativo e simulatório</strong>.
        </p>
        <p>
          Os resultados gerados <strong>não substituem</strong> o parecer técnico individualizado de um <strong>Contador habilitado no CRC (Conselho Regional de Contabilidade)</strong> ou de um <strong>Advogado inscrito na OAB</strong>, pois alíquotas municipais de ISS, convenções coletivas sindicais (CCT), benefícios fiscais estaduais e particularidades societárias podem alterar o cálculo final.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-600" />
          2. Precisão e Atualização das Tabelas Fiscais
        </h2>
        <p>
          Empenhamo-nos continuamente para manter o nosso arquivo central de regras fiscais atualizado conforme as publicações do Diário Oficial da União, Receita Federal do Brasil, INSS, IBGE e Banco Central. Contudo, tendo em vista que normas tributárias e previdenciárias estão sujeitas a medidas provisórias, portarias e regulamentações complementares ao longo do ano, o usuário deve sempre confirmar os valores antes de emitir guias de pagamento (DAS/DARF) ou assinar contratos de trabalho/prestação de serviços.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900">
          3. Propriedade Intelectual e Uso Gratuito
        </h2>
        <p>
          O uso dos simuladores por pessoas físicas, estudantes, profissionais liberais e contadores é 100% gratuito. É proibida a cópia automatizada integral (*scraping* malicioso) ou a reprodução comercial do código-fonte proprietário sem autorização prévia, sendo livre o compartilhamento dos links das nossas páginas e tabelas com a devida citação da fonte (<strong>CalculaFiscal</strong>).
        </p>
      </section>

      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold text-blue-600">
        <Link href="/sobre" className="hover:underline">
          Ver Metodologia de Cálculo →
        </Link>
        <Link href="/politica-de-privacidade" className="hover:underline">
          Ver Política de Privacidade (LGPD) →
        </Link>
      </div>
    </div>
  );
}
