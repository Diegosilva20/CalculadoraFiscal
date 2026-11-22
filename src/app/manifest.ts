import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CalculaFiscal 2026 — Simuladores Trabalhistas e Tributários",
    short_name: "CalculaFiscal",
    description:
      "Calculadora CLT vs PJ, Tabela CNAE Simples Nacional, Fator R (28%), Salário Líquido com isenção de IRPF até R$ 5.000, Rescisão e Custo de Funcionário.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
