---
name: claude-seo
description: >
  Comprehensive 2026 SEO & Generative Engine Optimization (GEO) skill (adapted from AgriciDaniel/claude-seo v2.4.2).
  Covers 5 core pillars: Programmatic SEO (thin-content & scaled-content-abuse safeguards), Content E-E-A-T for YMYL
  (Google Who/How/Why test), AI Search / GEO (Google AI Overviews, Perplexity & ChatGPT citability), Schema.org JSON-LD
  2026 rules (Active vs Deprecated rich results), and Technical SEO / Core Web Vitals (LCP, INP, CLS & AdSense safety).
license: MIT
metadata:
  author: AgriciDaniel (curated for high-CPC programmatic portals)
  version: "2.4.2"
---

# Claude SEO — Core 5 Pillars (2026 Edition)

## Pillar 1: Programmatic SEO (`seo-programmatic`)
Build and audit SEO pages generated at scale from structured data sources while enforcing quality gates to prevent thin-content penalties and Google's Scaled Content Abuse enforcement.

### Quality Gates & Thin Content Safeguards
- **Content differentiation:** >= 35–40% of content and calculated metrics must be genuinely unique between any two programmatic pages (never rely on simple "mad-libs" string replacement).
- **Standalone value test:** Every generated URL must answer: *"Would this page be genuinely useful as a standalone calculator/guide even if no other similar pages existed?"*
- **Data-driven computed blocks:** Inject real computed outputs (e.g., exact tax brackets, effective rates, comparative tables, specific rules, CNAE-specific or salary-specific diagnostics) directly into the server-rendered HTML (`SSR`).
- **Hub & Spoke Internal Linking:**
  - Category hub pages must link to spoke pages.
  - Every spoke page must cross-link to **3–6 related sibling pages** (e.g., adjacent salary brackets, other professions at the same income, or related CNAEs in the same sector) with descriptive anchor text.
  - Every spoke page must include both visual breadcrumbs and `BreadcrumbList` JSON-LD schema matching the URL hierarchy.

---

## Pillar 2: Content Quality & YMYL E-E-A-T (`seo-content`)
Financial, tax, labor, and accounting pages are strictly classified as **YMYL (Your Money or Your Life)**.

### Google's Canonical "Who / How / Why" Test
1. **Who created it?** Clear institutional identity, methodology page (`/sobre`), and explicit legal/technical responsibility disclaimers.
2. **How was it created?** Transparent calculation methodology citing official primary sources (e.g., Lei Complementar 123/2006, EC 132/2023, PLP 68/2024, Receita Federal tables, Banco Central / IBGE APIs).
3. **Why does it exist?** To help users make accurate simulations with zero paywalls, rather than baiting clicks with generic filler text.

---

## Pillar 3: AI Search & Generative Engine Optimization (`seo-geo`)
Aligned with Google's AI Optimization Guide (May 2026) for **Google AI Overviews**, **ChatGPT Search**, and **Perplexity**.

### Passage Citability & Answer Engine Readiness
- **Direct Answer Lead-ins (40–60 words):** Immediately below question-based `<h2>` or `<h3>` headings, provide a self-contained, factual 40–60 word passage with concrete numbers that an AI engine can quote verbatim.
- **Structured HTML Tables:** Present multi-variable comparisons (e.g., Anexo III vs Anexo V, CLT vs PJ, Simples vs Presumido) in clean semantic `<table>` elements in SSR HTML.
- **Primary-Source Citations:** Anchor claims to verifiable statutes and official rates (LC 123/2006, CLT Art. 477, INSS/IRPF 2026 progressive tables).

---

## Pillar 4: Schema.org JSON-LD 2026 Rules (`seo-schema`)
Always use **JSON-LD** (`<script type="application/ld+json">`) rendered in the initial server HTML (`SSR`).

### Schema Status Rules (2026 Update)
- **ACTIVE & HIGH-VALUE (Recommend & Implement on Every Route):**
  - `WebApplication` / `SoftwareApplication` (with `applicationCategory: "FinanceApplication"`, `operatingSystem: "Web"`, free `Offer`)
  - `BreadcrumbList` (reflecting the exact URL hierarchy for SERP rich crumbs)
  - `Organization` & `WebSite`
  - `Article` / `TechArticle`
- **RETIRED FROM SERP RICH RESULTS (Keep only for AI/entity clarity, never rely on for SERP snippets):**
  - `FAQPage` (Google retired FAQ rich results for non-gov sites and fully retired them in May 2026; still useful for AI extraction, but must be paired with `SoftwareApplication` and `BreadcrumbList`).
- **DEPRECATED (Never Use):**
  - `HowTo`, `EstimatedSalary`, `SpecialAnnouncement`, `ClaimReview`, `PracticeProblem`.

---

## Pillar 5: Technical SEO & Core Web Vitals (`seo-technical`)
- **Core Web Vitals 2026 Targets:**
  - **LCP (Largest Contentful Paint):** <= 2.5s
  - **INP (Interaction to Next Paint):** <= 200ms
  - **CLS (Cumulative Layout Shift):** <= 0.10 (CRITICAL for AdSense portals: every ad container MUST reserve a fixed `min-h-[...]` height so asynchronous ad scripts never push content down).
- **Canonical & Indexability:** Every route must define a self-referencing canonical URL (or relative metadata canonical via `metadataBase`), clean lowercase hyphenated slugs under 100 chars, and automatic inclusion in `/sitemap.xml`.
