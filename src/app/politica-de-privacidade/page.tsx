import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade, Cookies e Conformidade LGPD",
  description:
    "Política de Privacidade do portal CalculaFiscal em conformidade com a LGPD (Lei nº 13.709/2018) e diretrizes de publicidade do Google AdSense.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5" />
          Conformidade LGPD (Lei nº 13.709/2018) & Google AdSense
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Política de Privacidade e Proteção de Dados
        </h1>
        <p className="text-xs text-slate-500">
          Última atualização: 21 de outubro de 2026 • Vigente para todo o domínio CalculaFiscal.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          1. Processamento 100% Local dos Cálculos Financeiros
        </h2>
        <p>
          A sua privacidade financeira é prioridade absoluta no <strong>CalculaFiscal</strong>. Todos os valores digitados em nossas calculadoras (como salário bruto, faturamento PJ, benefícios, número de dependentes ou tempo de empresa) são processados <strong>exclusivamente no navegador do seu próprio dispositivo (Client-Side)</strong>.
        </p>
        <p>
          <strong>Nós não armazenamos, não gravamos em banco de dados e não vinculamos os valores simulados ao seu CPF, CNPJ, endereço IP ou identidade pessoal.</strong>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Cookie className="w-5 h-5 text-amber-600" />
          2. Cookies de Publicidade e Google AdSense (DoubleClick DART)
        </h2>
        <p>
          Para manter todas as nossas ferramentas e tabelas 100% gratuitas e abertas ao público, exibimos anúncios fornecidos pela rede <strong>Google AdSense</strong>. Em conformidade com os termos exigidos pelo Google, informamos que:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Terceiros, incluindo o <strong>Google</strong>, utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário ao nosso site ou a outros sites na internet.
          </li>
          <li>
            Com o uso de cookies de publicidade (como o cookie <strong>DoubleClick DART</strong>), o Google e seus parceiros podem veicular anúncios relevantes para os usuários com base nas visitas feitas ao CalculaFiscal e/ou a outros sites na internet.
          </li>
          <li>
            Os usuários podem desativar a publicidade personalizada a qualquer momento acessando as{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline"
            >
              Configurações de Anúncios do Google (Ads Settings)
            </a>{" "}
            ou visitando o portal{" "}
            <a
              href="https://www.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline"
            >
              www.aboutads.info
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          3. Coleta de Dados de Navegação e Métricas Anônimas
        </h2>
        <p>
          Coletamos apenas informações técnicas agregadas e anonimizadas estritamente necessárias para medir o desempenho e a estabilidade das páginas (como tipo de navegador, sistema operacional, páginas mais visitadas e tempo médio de carregamento — Core Web Vitals).
        </p>
        <p>
          Caso você entre em contato voluntariamente conosco através da página de{" "}
          <Link href="/contato" className="text-blue-600 font-semibold underline">
            Contato
          </Link>
          , os dados informados (nome e e-mail) serão utilizados única e exclusivamente para responder à sua solicitação, jamais sendo vendidos ou compartilhados com terceiros.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900">
          4. Seus Direitos sob a LGPD (Lei Geral de Proteção de Dados)
        </h2>
        <p>
          Nos termos do Art. 18 da Lei Federal nº 13.709/2018 (LGPD), você tem direito a confirmar a existência de tratamento de dados, revogar o consentimento de cookies a qualquer momento limpando os dados do seu navegador ou utilizando nosso banner de preferências de privacidade, e solicitar esclarecimentos através do nosso canal oficial em{" "}
          <Link href="/contato" className="text-blue-600 font-semibold underline">
            /contato
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
