import React from "react";
import type { Metadata } from "next";
import { CNAES_DATA } from "@/data/cnaes";
import CNAEDirectoryClient from "@/components/CNAEDirectoryClient";
import AdSlot from "@/components/AdSlot";
import SnowballLinks from "@/components/SnowballLinks";
import { buildCalculatorSchemaGraph } from "@/lib/seo-schema";

export const metadata: Metadata = {
  title: "Tabela CNAE Simples Nacional 2026 — Anexo III, V, Fator R, MEI e Reforma Tributária",
  description:
    "Consulte a tabela completa de CNAEs 2026 com busca inteligente: veja se pode ser MEI, qual o Anexo do Simples Nacional (I, III, IV ou V), se tem Fator R (6%) e redução do IVA Dual (CBS/IBS).",
  alternates: {
    canonical: "/cnae",
  },
};

export default function CNAEDirectoryPage() {
  const schemaGraph = buildCalculatorSchemaGraph({
    title: "Tabela CNAE Simples Nacional 2026 — Consulta de Anexo, Fator R, MEI e IVA",
    description:
      "Diretório interativo de CNAEs 2026 com simulador de guia DAS do Simples Nacional, enquadramento MEI, Fator R 28% e alíquota da Reforma Tributária (CBS/IBS).",
    path: "/cnae",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Tabela CNAE 2026", path: "/cnae" },
    ],
    faqs: [
      {
        question: "Como saber se um CNAE é Anexo III ou Anexo V no Simples Nacional em 2026?",
        answer:
          "Serviços técnicos, operacionais, de manutenção, saúde (algumas modalidades) e suporte costumam entrar diretamente no Anexo III (6% inicial). Já serviços intelectuais, de tecnologia, engenharia, consultoria e publicidade entram originalmente no Anexo V (15,5%), mas migram para o Anexo III (6%) se mantiverem Fator R igual ou superior a 28%.",
      },
    ],
  });

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Motor de Consulta Fiscal 2026 • Simples Nacional, MEI e Reforma Tributária
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Tabela CNAE 2026: Anexo do Simples Nacional, Fator R e Alíquota do IVA
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Pesquise o código ou nome da sua profissão abaixo para abrir a{" "}
          <strong>calculadora de impostos ao vivo</strong>, descobrir como cair do Anexo V (15,5%) para o Anexo III (6%) usando o Fator R e conferir a redução setorial aprovada na Reforma Tributária (CBS/IBS).
        </p>
      </div>

      <AdSlot
        slotId="cnae-hub-top"
        format="leaderboard"
        label="Não sabe qual CNAE escolher para pagar o menor imposto legal? Fale grátis com um especialista contábil"
      />

      <CNAEDirectoryClient cnaes={CNAES_DATA} />

      <SnowballLinks currentSalary={10000} />
    </div>
  );
}
