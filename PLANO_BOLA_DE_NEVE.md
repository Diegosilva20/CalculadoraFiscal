# Plano Mestre: CalculaFiscal 2026 — Estratégia "Bola de Neve" (SEO Programático + Google AdSense)

> **Objetivo Central do Projeto:** Construir e escalar um portal de calculadoras trabalhistas, tributárias (PJ/MEI/Simples Nacional/Reforma Tributária) e financeiras focado no Brasil em Português, otimizado para **tráfego orgânico de cauda longa (pSEO)** e **maximização de RPM no Google AdSense**.

---

## 1. Por que este modelo vence em 2026?

1. **Imune ao AI Overviews (Zero-Click Searches):** O usuário não quer apenas um texto teórico; ele precisa simular seu salário exato, testar se compensa ativar o Fator R (28%), ver a tabela discriminada de impostos e comparar CLT vs. PJ até o centavo.
2. **Os Maiores CPCs do Google Ads no Brasil:** Bancos PJ (BTG, Cora, Inter, Itaú), Contabilidades Digitais (Contabilizei, Agilize), ERPs (Omie, Bling, Conta Azul) e Financeiras de Crédito/FGTS pagam de **R$ 2,00 a R$ 6,00+ por clique**, gerando um **RPM de R$ 35 a R$ 90+**.
3. **Público sem AdBlock:** Trabalhadores CLT, médicos, engenheiros, arquitetos, advogados, representantes comerciais e pequenos empresários quase não utilizam bloqueadores de anúncio (diferente do nicho puramente dev).
4. **Janela Regulatória 2026:** Atualizado com a **nova isenção de IRPF até R$ 5.000 (e redutor gradual até R$ 7.000)**, **Fator R do Simples Nacional** e **ano-teste da Reforma Tributária (CBS 0,9% + IBS 0,1% e reduções setoriais de 30% e 60% no IVA Dual)**.

---

## 2. Arquitetura da Estratégia "Bola de Neve" (Os 3 Motores)

O crescimento do site funciona em efeito Bola de Neve: **1 único motor matemático confiável** gera centenas/milhares de páginas específicas que se retroalimentam com links internos, fazendo cada visitante navegar por **3 a 5 páginas por sessão** (multiplicando os ganhos do AdSense).

### Motor 1 — Consulta e Calculadora de CNAE + Simples Nacional / Reforma 2026
- **Rotas:** `/cnae` e `/cnae/[slug]`
- **Como atrai tráfego:** Quem vai abrir CNPJ ou mudar de CLT para PJ pesquisa no Google códigos específicos: *"CNAE 6201-5/01 pode ser MEI?"*, *"Qual o anexo e alíquota do CNAE 8630-5/03?"*, *"CNAE 7319-0/02 tem Fator R?"*.
- **Diferencial:** Cada página de CNAE possui uma **calculadora interativa da Guia DAS + Fator R + Reforma Tributária** integrada com dados oficiais da **API do IBGE (CONCLA)**.

### Motor 2 — Simulador CLT vs. PJ 2026 por Faixa Salarial e Profissão
- **Rotas:**
  - `/clt-vs-pj` (Hub Principal + Tabela de Equivalência)
  - `/clt-vs-pj/salario/[valor]` (Páginas programáticas por faixa salarial: ex. *"Salário de R$ 8.000 CLT equivale a quanto PJ em 2026?"*)
  - `/clt-vs-pj/profissao/[slug]` (Páginas programáticas por profissão: ex. *"Calculadora CLT vs PJ para Médico / Desenvolvedor / Engenheiro"*)
- **Como atrai tráfego:** Captura buscas exatas de alta intenção comercial onde não existem calculadoras pré-preenchidas concorrentes.

### Motor 3 — Calculadoras Clássicas de Retenção e Ciclo Completo
- **Rotas:**
  - `/calculadora-salario-liquido` (Salário Líquido 2026 com isenção até R$ 5.000)
  - `/calculadora-rescisao` (Rescisão Trabalhista CLT + Multa 40% FGTS + Calculadora de Férias com Abono Pecuniário)
- **Papel no Funil (Efeito Bola de Neve):**
  - O usuário entra por uma busca de Salário Líquido → clica no botão *"Ver quanto seu salário equivale como PJ"* → descobre o CNAE da sua profissão e clica para ver a alíquota de 6% no Simples → clica para calcular quanto vai receber de Rescisão CLT ao pedir demissão ou fazer acordo para virar PJ!

---

## 3. Como os Cálculos e Atualizações Fiscais Funcionam

Para garantir **Custo Zero de Servidor**, **Velocidade Nota 100 no Google** e **Manutenção em 1 Minuto**:

1. **Fonte Única da Verdade (`src/config/parametros-fiscais.json`):**
   - Todas as alíquotas, faixas do INSS, faixas do IRPF, redutor de R$ 5.000 a R$ 7.000, salário mínimo, teto do MEI e tabelas dos Anexos I a V do Simples Nacional ficam neste único arquivo JSON.
   - **Quando o governo mudar qualquer regra ou virar o ano:** basta editar `src/config/parametros-fiscais.json` e rodar o deploy. Todas as dezenas/milhares de páginas do site são recalculadas automaticamente!
2. **Integração com APIs Públicas Oficiais (`src/lib/gov-apis.ts`):**
   - **API do Banco Central do Brasil (SGS):** Busca automaticamente a **Taxa Selic** e o **IPCA (Inflação acumulada 12m)** atualizados (com cache de 24h e fallback seguro se a API do governo oscilar).
   - **API do IBGE (CONCLA/CNAE):** Consulta dados oficiais das subclasses CNAE diretamente da base do IBGE durante a geração das páginas.

---

## 4. Posicionamento Estratégico do Google AdSense (`src/components/AdSlot.tsx`)

- **Zero CLS (Cumulative Layout Shift):** Todos os blocos de anúncio reservam altura mínima fixa (`min-h-[96px]`, `min-h-[120px]`, `min-h-[250px]`) para nunca empurrar o conteúdo enquanto carregam.
- **Slots de Maior CTR:**
  1. `leaderboard` abaixo do cabeçalho explicativo.
  2. `in-result` posicionado **exatamente acima do Card de Veredito / Resultado Final** (onde 100% dos usuários fixam o olhar após interagir com os controles).
- **Ativação:** Basta definir `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX` no `.env.local` (ou nas variáveis de ambiente da Vercel).

---

## 5. Roteiro de Evolução (Próximos Passos)

- [x] **Fase 1 (Concluída):** Criação do motor fiscal 2026, centralização em `parametros-fiscais.json`, integração com APIs do Banco Central/IBGE e geração das primeiras **64 páginas estáticas (SSG)** + `sitemap.xml`.
- [x] **Fase 2 (Concluída - Pré-Aprovação AdSense & E-E-A-T):** Páginas institucionais obrigatórias criadas (`/sobre`, `/politica-de-privacidade`, `/termos-de-uso`, `/contato`), banner de consentimento de cookies (LGPD) em `src/components/CookieConsentBanner.tsx` e arquivo `/ads.txt` configurado em `public/ads.txt`.
- [x] **Fase 3 (Concluída - Expansão Programática pSEO & Busca Instantânea):** Base expandida para **47 CNAEs estratégicos**, **24 Profissões de alto CPC** e **69 Faixas Salariais de cauda longa** (154 páginas estáticas geradas no `sitemap.xml`), além do motor de busca e filtro instantâneo em `src/components/CNAEDirectoryClient.tsx`.
- [x] **Fase 4 (Pronto para Deploy):** Repositório Git inicializado com `.gitignore`, `.env.example` e commit inicial pronto para subir no GitHub e publicar gratuitamente na Vercel.

---

## 6. Guia Rápido de Publicação (Vercel + Domínio + Google Search Console + AdSense)

### Passo 1: Subir para o GitHub e Publicar na Vercel (Custo: R$ 0,00)
1. Crie um repositório vazio na sua conta do [GitHub](https://github.com/new) (ex.: `calculafiscal`).
2. No terminal dentro da pasta `C:\Users\depau\.gemini\antigravity\scratch\calculafiscal`, rode:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/calculafiscal.git
   git branch -M main
   git push -u origin main
   ```
3. Entre em [vercel.com](https://vercel.com) com sua conta do GitHub, clique em **"Add New... -> Project"**, importe o repositório `calculafiscal` e clique em **Deploy**. Em 1 minuto o site estará no ar com HTTPS gratuito!

### Passo 2: Registrar Domínio `.com.br` (Opcional, mas recomendado para AdSense)
1. No [Registro.br](https://registro.br), registre um domínio próprio (custa R$ 40/ano — ex.: `calculafiscal.com.br`, `simulafiscal.com.br` ou `cltvspj.com.br`).
2. Na aba **Settings -> Domains** do seu projeto na Vercel, adicione o domínio e aponte o DNS conforme a Vercel mostrar na tela.

### Passo 3: Indexar todas as 154 páginas no Google Search Console
1. Acesse o [Google Search Console](https://search.google.com/search-console) e adicione seu domínio.
2. No menu lateral, clique em **Sitemaps** e digite:
   ```text
   sitemap.xml
   ```
3. Clique em **Enviar**. O robô do Google descobrirá imediatamente todas as 154 páginas de salários, profissões e CNAEs!

### Passo 4: Solicitar Aprovação no Google AdSense
1. Crie sua conta em [google.com/adsense](https://www.google.com/adsense) e adicione o seu site.
2. Copie o seu código `ca-pub-XXXXXXXXXXXXXXXX` fornecido pelo AdSense:
   - Coloque na variável de ambiente `NEXT_PUBLIC_ADSENSE_CLIENT_ID` no painel da Vercel (**Settings -> Environment Variables**).
   - Substitua `pub-0000000000000000` pelo seu `pub-XXXXXXXXXXXXXXXX` dentro do arquivo [`public/ads.txt`](./public/ads.txt).
3. Como o site já tem 154 páginas ricas, dados oficiais, `/sobre` com metodologia matemática, `/politica-de-privacidade` com a cláusula DoubleClick DART, `/termos-de-uso`, `/contato` e banner de cookies LGPD, ele já cumpre 100% dos requisitos técnicos para aprovação!
