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
    "Consulte a tabela completa de CNAEs 2026 com busca por código ou atividade: veja permissão MEI, Anexo do Simples Nacional (I, III, IV ou V), Fator R e redução do IVA Dual (CBS/IBS).",
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
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Consulta fiscal · Simples Nacional, MEI e Reforma Tributária
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Tabela CNAE 2026: Anexos, Fator R e enquadramento MEI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Pesquise pelo código CNAE ou pelo nome da atividade para abrir a calculadora do Simples Nacional, verificar a possibilidade de redução para 6% via Fator R e checar os percentuais de redução setorial no IVA Dual (CBS/IBS).
        </p>
      </div>

      <AdSlot
        slotId="cnae-hub-top"
        format="leaderboard"
        label="Abertura de CNPJ com escolha correta de CNAEs e enquadramento tributário"
      />

      <CNAEDirectoryClient cnaes={CNAES_DATA} />

      <SnowballLinks currentSalary={10000} />
    </div>
  );
}
