import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fale Conosco — Atendimento Editorial e Parcerias",
  description:
    "Entre em contato com a equipe do CalculaFiscal 2026 para sugerir novos códigos CNAE, revisar alíquotas ou tratar sobre parcerias comerciais.",
  alternates: {
    canonical: "/contato",
  },
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
