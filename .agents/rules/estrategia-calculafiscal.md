---
description: Contexto estratégico e técnico do projeto CalculaFiscal 2026 (Estratégia Bola de Neve para SEO Programático e Google AdSense)
---

# Contexto Permanente do Projeto: CalculaFiscal 2026

Sempre que atuar neste projeto, siga as diretrizes do plano mestre em `PLANO_BOLA_DE_NEVE.md`:

1. **Propósito:** Portal de calculadoras trabalhistas, tributárias (Simples Nacional, Fator R, CNAE, Reforma Tributária CBS/IBS) e financeiras focado no Brasil (Português), monetizado via **Google AdSense** através da **Estratégia "Bola de Neve" (SEO Programático + Links Internos Cruzados)**.
2. **Fonte Única de Parâmetros Fiscais:** Nunca espalhe alíquotas ou limites numéricos fixos nos componentes visuais. Todas as faixas de INSS, IRPF (isenção até R$ 5.000 e transição até R$ 7.000), Salário Mínimo, Teto MEI e Anexos do Simples Nacional devem vir de `src/config/parametros-fiscais.json` consumido por `src/lib/calculators.ts`.
3. **APIs Oficiais Governamentais:** O módulo `src/lib/gov-apis.ts` conecta às APIs públicas gratuitas do **Banco Central do Brasil (Selic/IPCA)** e **IBGE (CNAE)** com cache (`revalidate: 86400`) e fallback seguro para nunca quebrar o build estático.
4. **Core Web Vitals, AdSense & Skills Ativas (`frontend-design`, `humanizer`, `claude-seo`):**
   - Mantenha páginas rápidas (SSG via `generateStaticParams`), componentes `AdSlot` com altura mínima reservada (Zero CLS) e avisos legais (`LegalDisclaimerBox`).
   - Utilize sempre `buildCalculatorSchemaGraph` (`src/lib/seo-schema.ts`) para emitir `@graph` com `SoftwareApplication` (`FinanceApplication`), `BreadcrumbList` e `FAQPage` (GEO) no HTML renderizado no servidor, além de `alternates.canonical` em todas as rotas.
