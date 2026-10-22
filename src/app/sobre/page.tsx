import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PARAMETROS_FISCAIS,
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  TETO_ANUAL_MEI_2026,
  formatBRL,
} from "@/lib/calculators";
import { ShieldCheck, BookOpen, Landmark, CheckCircle2, FileCode2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre o CalculaFiscal e Metodologia Oficial de Cálculo (2026)",
  description:
    "Conheça a metodologia matemática, fontes legislativas oficiais (Receita Federal, INSS, IBGE e Banco Central) e critérios técnicos utilizados nas calculadoras do CalculaFiscal 2026.",
};

export default function SobreMetodologiaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Transparência Editorial & Metodologia Técnica
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Sobre o CalculaFiscal e Nossa Metodologia de Cálculo (2026)
        </h1>

        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          O <strong>CalculaFiscal</strong> é uma plataforma brasileira independente de tecnologia e educação financeira, criada para traduzir a complexa legislação trabalhista (CLT) e tributária empresarial (Simples Nacional, MEI e Reforma Tributária) em simuladores interativos gratuitos, transparentes e auditáveis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Ano-Calendário Vigente
            </span>
            <p className="text-xl font-black text-blue-700 mt-1">
              {PARAMETROS_FISCAIS.anoVigencia}
            </p>
            <span className="text-[11px] text-slate-500">
              Revisado em {PARAMETROS_FISCAIS.ultimaAtualizacao}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Salário Mínimo / Teto INSS
            </span>
            <p className="text-lg font-black text-slate-900 mt-1">
              {formatBRL(SALARIO_MINIMO_2026)} / {formatBRL(TETO_INSS_2026)}
            </p>
            <span className="text-[11px] text-slate-500">
              Tabela Progressiva Oficial
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500">
              Privacidade dos Cálculos
            </span>
            <p className="text-lg font-black text-emerald-700 mt-1">
              100% no Navegador
            </p>
            <span className="text-[11px] text-slate-500">
              Nenhum salário é salvo em banco de dados
            </span>
          </div>
        </div>
      </div>

      {/* Metodologia Matemática Detalhada */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          Fórmulas Oficiais e Base Legal Utilizadas
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900">
          Como cada imposto e verba trabalhista é calculado
        </h2>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">
              1. Simples Nacional e Fator R (Lei Complementar nº 123/2006)
            </h3>
            <p>
              Diferente de calculadoras simplistas que multiplicam o faturamento apenas pela alíquota nominal inicial, nosso motor aplica a fórmula oficial da Receita Federal considerando a <strong>Receita Bruta Acumulada nos últimos 12 meses (RBT12)</strong> e a parcela a deduzir de cada faixa:
            </p>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs overflow-x-auto font-mono">
              Alíquota Efetiva = ((RBT12 × Alíquota Nominal) - Parcela a Deduzir) / RBT12
            </pre>
            <p>
              Para atividades intelectuais do <strong>Anexo V</strong> (como tecnologia, medicina, engenharia, consultoria e marketing), calculamos automaticamente o <strong>Fator R</strong>: quando a razão entre Folha de Salários/Pró-Labore e Receita Bruta atinge <strong>28% ou mais</strong>, a tributação migra legalmente para o <strong>Anexo III</strong> (iniciando em 6% em vez de 15,5%).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">
              2. INSS Progressivo e Imposto de Renda Retido na Fonte (IRPF 2026)
            </h3>
            <p>
              O desconto previdenciário (INSS) na CLT é calculado de forma <strong>progressiva faixa a faixa</strong> (7,5%, 9%, 12% e 14% até o teto previdenciário de {formatBRL(TETO_INSS_2026)}).
            </p>
            <p>
              Para o Imposto de Renda 2026, o sistema aplica a <strong>isenção efetiva para rendimentos mensais até R$ 5.000,00</strong>, a transição gradual para rendimentos entre R$ 5.000,01 e R$ 7.000,00, e compara automaticamente a dedução legal (INSS + R$ 189,59 por dependente) contra o <strong>Desconto Simplificado Mensal (R$ 607,20)</strong>, escolhendo sempre a opção que resulta no menor imposto para o trabalhador.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">
              3. Reforma Tributária (EC nº 132/2023 e LC nº 214/2025 — CBS e IBS)
            </h3>
            <p>
              Em 2026, inicia-se o ano-teste do IVA Dual brasileiro: a <strong>CBS (Contribuição sobre Bens e Serviços - Federal, 0,9%)</strong> e o <strong>IBS (Imposto sobre Bens e Serviços - Estadual/Municipal, 0,1%)</strong>. Nossos simuladores por CNAE já contemplam os regimes diferenciados com redução de <strong>30% para profissões intelectuais regulamentadas por conselho</strong> (engenharia, arquitetura, advocacia, contabilidade) e redução de <strong>60% para serviços de saúde e educação</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Fontes Governamentais e APIs */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
          <Landmark className="w-4 h-4" />
          Fontes de Dados Governamentais & APIs Conectadas
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          De onde vêm os dados do CalculaFiscal?
        </h2>
        <ul className="space-y-3 text-sm text-slate-700">
          {PARAMETROS_FISCAIS.fontesOficiais.map((fonte, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>{fonte}</span>
            </li>
          ))}
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
            <span>
              <strong>API Oficial do Banco Central do Brasil (SGS):</strong> Consulta automatizada das séries temporais nº 432 (Taxa Selic Meta) e nº 13522 (IPCA acumulado em 12 meses).
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
            <span>
              <strong>API Oficial do IBGE (CONCLA / Subclasses CNAE 2.3):</strong> Validação da hierarquia oficial de seções, divisões e atividades econômicas brasileiras.
            </span>
          </li>
        </ul>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold text-blue-600">
          <Link href="/politica-de-privacidade" className="hover:underline">
            Ler Política de Privacidade e LGPD →
          </Link>
          <Link href="/termos-de-uso" className="hover:underline">
            Ler Termos de Uso e Isenção Contábil →
          </Link>
          <Link href="/contato" className="hover:underline">
            Falar com Nossa Equipe Editorial →
          </Link>
        </div>
      </section>
    </div>
  );
}
