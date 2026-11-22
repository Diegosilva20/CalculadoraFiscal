import type { Metadata } from "next";
import { buildInstitutionalPageSchema, buildSocialMetadata } from "@/lib/seo-schema";

const TITLE = "Fale Conosco — Atendimento Editorial e Parcerias";
const DESCRIPTION =
  "Entre em contato com a equipe do CalculaFiscal 2026 para sugerir novos códigos CNAE, revisar alíquotas ou tratar sobre parcerias comerciais.";

export const metadata: Metadata = buildSocialMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/contato",
});

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaGraph = buildInstitutionalPageSchema({
    title: TITLE,
    description: DESCRIPTION,
    path: "/contato",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Contato", path: "/contato" },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      {children}
    </>
  );
}
