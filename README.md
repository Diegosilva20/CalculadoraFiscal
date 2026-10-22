# CalculaFiscal 2026 — Portal de SEO Programático & Google AdSense

Este projeto implementa a **Estratégia "Bola de Neve"** para geração de tráfego orgânico qualificado no Google Brasil em 2026 com alto RPM no Google AdSense (Nicho Finanças, Contabilidade B2B, Tributário e Trabalhista).

## 🚀 Os 3 Motores do Portal

1. **Motor 1 — Tabela e Calculadora de CNAE + Fator R + Reforma Tributária (`/cnae` e `/cnae/[slug]`):**
   - Páginas estáticas geradas automaticamente (`SSG`) para cada CNAE com calculadora ao vivo da Guia DAS do Simples Nacional, economia pelo Fator R (28% de folha para cair de 15,5% para 6% no Anexo III), elegibilidade MEI e redução setorial do novo IVA Dual (CBS/IBS 2026).
2. **Motor 2 — Simulador CLT vs PJ 2026 por Faixa Salarial e Profissão (`/clt-vs-pj/salario/[valor]` e `/clt-vs-pj/profissao/[slug]`):**
   - Gera dezenas de páginas pré-calculadas para buscas de cauda longa sem concorrência (ex.: *"Salário de R$ 8.000 CLT equivale a quanto PJ em 2026?"* ou *"Calculadora CLT vs PJ para Desenvolvedor / Médico / Engenheiro"*).
3. **Motor 3 — Calculadoras Clássicas de Retenção (`/calculadora-salario-liquido` e `/calculadora-rescisao`):**
   - Atualizadas com a nova isenção do Imposto de Renda até R$ 5.000 (e redutor até R$ 7.000) em 2026, mantendo o usuário navegando por múltiplas páginas na mesma sessão através do componente `SnowballLinks`.

---

## 💰 Como Ativar o Google AdSense Real

1. Crie ou acesse sua conta no **Google AdSense** e cadastre seu domínio.
2. Crie um arquivo `.env.local` na raiz do projeto com o seu ID de editor:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
3. O componente [`src/components/AdSlot.tsx`](./src/components/AdSlot.tsx) já reserva a altura exata dos anúncios (**Zero CLS / Nota 100 no Core Web Vitals**) e troca automaticamente os blocos de demonstração pelos anúncios reais da rede do Google.

---

## 📈 Como Escalar de 60 para +2.000 Páginas Indexadas

- Para adicionar novos CNAEs: basta inserir novos objetos no array `CNAES_DATA` em [`src/data/cnaes.ts`](./src/data/cnaes.ts).
- Para adicionar novas faixas salariais ou profissões: edite `FAIXAS_SALARIAIS_SEO` e `PROFISSOES_SEO` em [`src/data/profissoes.ts`](./src/data/profissoes.ts).
- O arquivo [`src/app/sitemap.ts`](./src/app/sitemap.ts) inclui todas as novas páginas automaticamente no `/sitemap.xml` para o Google Search Console.

---

## 🛠️ Comandos Locais

```bash
npm run dev     # Inicia o servidor local em http://localhost:3000
npm run build   # Gera todas as páginas estáticas de SEO Programático
npm run start   # Roda a versão otimizada de produção
```
