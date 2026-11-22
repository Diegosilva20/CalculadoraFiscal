import { CNAES_DATA, getCNAEBySlug } from "@/data/cnaes";
import { FAIXAS_SALARIAIS_SEO, PROFISSOES_SEO, getProfissaoBySlug } from "@/data/profissoes";
import {
  DAS_MEI_SERVICOS_2026,
  PARAMETROS_FISCAIS,
  SALARIO_MINIMO_2026,
  TETO_ANUAL_MEI_2026,
  TETO_INSS_2026,
  calculateCLTvsPJ,
  calculateCustoFuncionario2026,
  calculateFatorR2026,
  calculateSalarioLiquidoCLT,
  formatBRL,
  formatPercent,
} from "@/lib/calculators";
import { SITE_BASE_URL } from "@/lib/seo-schema";

export interface MarkdownResolution {
  status: number;
  body: string;
}

export function renderPageMarkdown(rawPath: string): MarkdownResolution {
  const normalized =
    rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath || "/";

  if (normalized === "/") {
    return {
      status: 200,
      body: `# CalculaFiscal 2026 — Calculadoras Trabalhistas e Tributárias

URL canônica: ${SITE_BASE_URL}

Portal gratuito de simulações trabalhistas e tributárias no Brasil atualizado para **${PARAMETROS_FISCAIS.anoVigencia}** (Salário Mínimo ${formatBRL(SALARIO_MINIMO_2026)}, Teto INSS ${formatBRL(TETO_INSS_2026)}, isenção de IRPF até R$ 5.000,00 e redutor da Lei nº 15.270/2025 até R$ 7.350,00).

## Ferramentas disponíveis

- [Comparador CLT vs PJ 2026](${SITE_BASE_URL}/clt-vs-pj): apura líquido CLT, pacote com FGTS/13º/férias/benefícios e faturamento mínimo equivalente no Simples Nacional.
- [Tabela CNAE 2026](${SITE_BASE_URL}/cnae): ${CNAES_DATA.length} atividades com Anexo, permissão MEI, Fator R e redução CBS/IBS.
- [Calculadora de Fator R (28%)](${SITE_BASE_URL}/calculadora-fator-r): compara Anexo III e Anexo V considerando RBT12 e FS12.
- [Salário Líquido e 13º 2026](${SITE_BASE_URL}/calculadora-salario-liquido): detalhamento faixa a faixa do INSS, IRRF e 1ª/2ª parcela do 13º salário.
- [Custo de Funcionário CLT](${SITE_BASE_URL}/custo-funcionario-clt): compara Simples Nacional, Anexo IV, Lucro Presumido/Real e MEI.
- [Rescisão e Férias CLT](${SITE_BASE_URL}/calculadora-rescisao): saldo de salário, aviso prévio proporcional, 13º, férias + 1/3 e FGTS.

## Dúvidas frequentes

### Como funciona a comparação entre salário CLT e proposta PJ em 2026?
Compara o salário líquido mensal e o pacote anual da CLT (FGTS de 8%, 13º proporcional, terço de férias e benefícios) com o lucro líquido estimado de uma empresa no Simples Nacional após descontar DAS, INSS sobre pró-labore, IRRF e contabilidade.

### Quando vale a pena usar o Fator R no Simples Nacional?
Atividades do Anexo V (a partir de 15,5%) migram para o Anexo III (a partir de 6%) quando a folha dos últimos 12 meses atinge pelo menos 28% da receita bruta acumulada (RBT12).
`,
    };
  }

  if (normalized === "/clt-vs-pj") {
    const amostra = [3000, 5000, 8000, 12000, 18000]
      .map((sal) => {
        const sim = calculateCLTvsPJ({
          salarioBrutoCLT: sal,
          faturamentoBrutoPJ: Math.round(sal * 1.45),
          beneficiosCLT: 900,
        });
        return `| ${formatBRL(sal)} | ${formatBRL(sim.clt.salarioLiquidoMensal)} | ${formatBRL(sim.clt.pacoteTotalMensalReal)} | ${formatBRL(sim.faturamentoPJEquivalente)} |`;
      })
      .join("\n");

    return {
      status: 200,
      body: `# Calculadora CLT vs PJ 2026

URL canônica: ${SITE_BASE_URL}/clt-vs-pj

## Amostra da tabela de equivalência (Anexo III com Fator R e R$ 900/mês de benefícios CLT)

| Salário bruto CLT | Líquido CLT | Pacote CLT (c/ FGTS + 13º + férias) | Faturamento PJ equivalente |
| --- | --- | --- | --- |
${amostra}

Disponibilizamos ${FAIXAS_SALARIAIS_SEO.length} faixas salariais detalhadas e ${PROFISSOES_SEO.length} cenários por profissão no [mapa do site](${SITE_BASE_URL}/sitemap.xml).
`,
    };
  }

  if (normalized === "/cnae") {
    const linhas = CNAES_DATA.slice(0, 15)
      .map(
        (c) =>
          `| ${c.codigo} | [${c.nomePopular}](${SITE_BASE_URL}/cnae/${c.slug}) | Anexo ${c.anexo} | ${c.fatorR ? "Sim (6%)" : "Não"} | ${c.permiteMEI ? "Sim" : "Não"} |`
      )
      .join("\n");

    return {
      status: 200,
      body: `# Tabela CNAE Simples Nacional 2026 (${CNAES_DATA.length} atividades)

URL canônica: ${SITE_BASE_URL}/cnae

Consulte o código completo, regras de MEI (teto ${formatBRL(TETO_ANUAL_MEI_2026)} e DAS serviços de ${formatBRL(DAS_MEI_SERVICOS_2026)}), elegibilidade ao Fator R (28%) e redução de CBS/IBS.

| Código | Atividade | Anexo Padrão | Fator R | Aceita MEI |
| --- | --- | --- | --- | --- |
${linhas}
`,
    };
  }

  if (normalized === "/calculadora-fator-r") {
    const ex = calculateFatorR2026({
      modo: "mensal",
      faturamentoMensal: 15000,
      rbt12: 180000,
      folhaAtualMensal: 4250,
      folha11MesesAnteriores: 46200,
    });
    return {
      status: 200,
      body: `# Calculadora de Fator R 2026 (Lei Complementar 123/2006)

URL canônica: ${SITE_BASE_URL}/calculadora-fator-r

Simula a razão entre Folha de Salários dos últimos 12 meses (FS12) e Receita Bruta acumulada (RBT12). Atingindo **28%**, a atividade migra do Anexo V (15,5% inicial) para o Anexo III (6% inicial).

## Exemplo de referência (faturamento R$ 15.000,00/mês)

- Pró-labore de 28%: ${formatBRL(ex.proLaboreIdealNesteMes)}
- Tributos totais no Anexo III (DAS + INSS + IRRF): ${formatBRL(ex.custoTotalComFatorR)}/mês
- Tributos totais no Anexo V: ${formatBRL(ex.custoTotalSemFatorR)}/mês
- Saldo de economia líquida anual: ${formatBRL(ex.saldoEconomiaMensal * 12)}/ano
`,
    };
  }

  if (normalized === "/calculadora-salario-liquido") {
    const exemplo = calculateSalarioLiquidoCLT({ salarioBruto: 5500 });
    return {
      status: 200,
      body: `# Calculadora de Salário Líquido e 13º Salário CLT 2026

URL canônica: ${SITE_BASE_URL}/calculadora-salario-liquido

Aplica o INSS progressivo por faixa até o teto de ${formatBRL(TETO_INSS_2026)} e as regras da Lei nº 15.270/2025 no IRRF 2026 (isenção até R$ 5.000,00, redutor gradual de 978,62 − 0,133145 × rendimento até R$ 7.350,00 e comparação automática entre deduções legais e desconto simplificado de R$ 607,20), inclusive para cálculo das 1ª e 2ª parcelas do 13º salário.

## Exemplo para R$ 5.500,00 brutos (0 dependentes)

- INSS progressivo: -${formatBRL(exemplo.inss)}
- IRRF: -${formatBRL(exemplo.irpf)} (critério ${exemplo.metodoIR})
- Economia com o redutor Lei nº 15.270/2025: +${formatBRL(exemplo.economiaRedutorLei15270)}/mês
- Salário líquido estimado: ${formatBRL(exemplo.salarioLiquidoMensal)}
`,
    };
  }

  if (normalized === "/custo-funcionario-clt") {
    const simples = calculateCustoFuncionario2026({
      salarioBruto: 3500,
      regime: "simples_geral",
      beneficiosVRPlano: 650,
      gastoBrutoVT: 250,
      incluirProvisaoMulta40: true,
    });
    const presumido = calculateCustoFuncionario2026({
      salarioBruto: 3500,
      regime: "lucro_presumido_real",
      beneficiosVRPlano: 650,
      gastoBrutoVT: 250,
      incluirProvisaoMulta40: true,
    });
    return {
      status: 200,
      body: `# Calculadora de Custo de Funcionário CLT 2026

URL canônica: ${SITE_BASE_URL}/custo-funcionario-clt

Comparação de encargos, provisões mensais (FGTS, 13º, férias + 1/3, reserva de multa 40%), INSS patronal e benefícios para salário-base de **R$ 3.500,00** (VR R$ 650 + VT R$ 250):

- **Simples Nacional (Anexos I, II, III e V)**: ${formatBRL(simples.custoTotalMensalEmpresa)}/mês (+${formatPercent(simples.sobrecustoPercentual)})
- **Lucro Presumido / Real (+27,8% patronal)**: ${formatBRL(presumido.custoTotalMensalEmpresa)}/mês (+${formatPercent(presumido.sobrecustoPercentual)})
`,
    };
  }

  if (normalized === "/calculadora-rescisao") {
    return {
      status: 200,
      body: `# Calculadora de Rescisão Trabalhista e Férias CLT 2026

URL canônica: ${SITE_BASE_URL}/calculadora-rescisao

Estima saldo de salário, aviso prévio proporcional (Lei 12.506/2011, 30 dias + 3 dias por ano completo até 90 dias), reflexos do aviso prévio indenizado em 13º e férias (OJ 82 SDI-1), férias proporcionais + 1/3, férias vencidas, descontos de INSS/IRRF (considerando isenção legal do aviso prévio indenizado e férias indenizadas) e saque/multa de FGTS (40% sem justa causa, 20% acordo trabalhista Art. 484-A), além de simulação separada de férias e abono pecuniário.
`,
    };
  }

  if (normalized === "/sobre") {
    return {
      status: 200,
      body: `# Sobre o CalculaFiscal e Metodologia Oficial (2026)

URL canônica: ${SITE_BASE_URL}/sobre

Portal independente mantido no Brasil para simulações trabalhistas e tributárias gratuitas com processamento 100% local no navegador.

## Base legal e APIs públicas integradas
- Receita Federal do Brasil: Lei nº 15.270/2025 para o IRPF 2026 (isenção até R$ 5.000, redutor gradual até R$ 7.350 e desconto simplificado de R$ 607,20) e fórmulas efetivas do Simples Nacional (LC 123/2006).
- Ministério da Previdência Social: alíquotas progressivas do INSS até o teto de ${formatBRL(TETO_INSS_2026)} e salário mínimo de ${formatBRL(SALARIO_MINIMO_2026)}.
- Reforma Tributária (EC 132/2023 e LC 214/2025): parâmetros do ano-teste de 2026 (CBS 0,9% e IBS 0,1%).
- APIs governamentais com cache de 24h: Banco Central do Brasil (Selic Meta série 432 e IPCA 12m série 13522) e IBGE CONCLA (Subclasses CNAE 2.3).

Contato: [contato@calculafiscal.com.br](mailto:contato@calculafiscal.com.br) · [${SITE_BASE_URL}/contato](${SITE_BASE_URL}/contato)
`,
    };
  }

  if (normalized === "/contato") {
    return {
      status: 200,
      body: `# Contato — CalculaFiscal

URL canônica: ${SITE_BASE_URL}/contato

Para reportar revisão de alíquotas de 2026, sugerir a inclusão de novos CNAEs ou tratar sobre parcerias, utilize o e-mail direto **contato@calculafiscal.com.br**.

O formulário na página gera um rascunho direto no seu cliente de e-mail (\`mailto:\`), sem armazenamento de nome ou mensagem em banco de dados.
`,
    };
  }

  if (normalized === "/politica-de-privacidade") {
    return {
      status: 200,
      body: `# Política de Privacidade e Conformidade LGPD — CalculaFiscal

URL canônica: ${SITE_BASE_URL}/politica-de-privacidade

- **Processamento 100% local**: os valores digitados nos simuladores não são gravados em servidor nem vinculados a CPF ou CNPJ.
- **Consent Mode v2 e Cookies**: estatísticas anônimas (Google Analytics 4) e futura exibição de anúncios (Google AdSense) respeitam o banner de consentimento LGPD e podem ser ajustadas a qualquer momento pelo link "Preferências de cookies" no rodapé.
- **Base legal**: conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
`,
    };
  }

  if (normalized === "/termos-de-uso") {
    return {
      status: 200,
      body: `# Termos de Uso — CalculaFiscal 2026

URL canônica: ${SITE_BASE_URL}/termos-de-uso

Todas as calculadoras e tabelas têm caráter estritamente simulatório, informativo e educacional com base em parâmetros federais padrão de 2026. Os resultados não substituem parecer formal de contador habilitado no CRC ou advogado.
`,
    };
  }

  if (normalized.startsWith("/clt-vs-pj/profissao/")) {
    const slug = normalized.replace("/clt-vs-pj/profissao/", "");
    const prof = getProfissaoBySlug(slug);
    if (prof) {
      const sim = calculateCLTvsPJ({
        salarioBrutoCLT: prof.salarioMedioCLT,
        faturamentoBrutoPJ: prof.propostaMediaPJ,
        beneficiosCLT: prof.beneficiosMediosCLT,
        anexoPJ: prof.anexoPadrao,
        sujeitoFatorR: prof.sujeitoFatorR,
      });
      return {
        status: 200,
        body: `# ${prof.tituloSEO}

URL canônica: ${SITE_BASE_URL}/clt-vs-pj/profissao/${prof.slug}

${prof.resumoMercado2026}

- **CNAE usual**: ${prof.cnaeRecomendadoCodigo} ([ver detalhes](${SITE_BASE_URL}/cnae/${prof.cnaeRecomendadoSlug}))
- **Anexo padrão**: Anexo ${prof.anexoPadrao} ${prof.sujeitoFatorR ? "(migra para Anexo III a 6% via Fator R)" : ""}
- **Referência CLT**: bruto ${formatBRL(prof.salarioMedioCLT)} · líquido ${formatBRL(sim.clt.salarioLiquidoMensal)} · pacote total ${formatBRL(sim.clt.pacoteTotalMensalReal)}/mês
- **Equivalência PJ mínima**: ${formatBRL(sim.faturamentoPJEquivalente)}/mês
- **Proposta PJ de referência (${formatBRL(prof.propostaMediaPJ)})**: líquido estimado ${formatBRL(sim.pj.lucroLiquidoIsento)}/mês
`,
      };
    }
  }

  if (normalized.startsWith("/clt-vs-pj/salario/")) {
    const rawVal = normalized.replace("/clt-vs-pj/salario/", "");
    if (/^\d+$/.test(rawVal)) {
      const salario = Number(rawVal);
      if (salario >= SALARIO_MINIMO_2026 && salario <= 200000) {
        const pjSugerido = Math.round(salario * 1.45);
        const sim = calculateCLTvsPJ({
          salarioBrutoCLT: salario,
          faturamentoBrutoPJ: pjSugerido,
          beneficiosCLT: 900,
          anexoPJ: "V",
          sujeitoFatorR: true,
          otimizarFatorR: true,
        });
        return {
          status: 200,
          body: `# Salário de ${formatBRL(salario)} CLT equivale a quanto PJ em 2026?

URL canônica: ${SITE_BASE_URL}/clt-vs-pj/salario/${salario}

- **Salário bruto CLT**: ${formatBRL(salario)}
- **INSS + IRRF na CLT**: -${formatBRL(sim.clt.inss + sim.clt.irpf)} (INSS ${formatBRL(sim.clt.inss)} · IRRF ${formatBRL(sim.clt.irpf)})
- **Líquido mensal em conta**: ${formatBRL(sim.clt.salarioLiquidoMensal)}
- **Pacote total CLT (com FGTS, 13º, férias e R$ 900 de benefícios)**: ${formatBRL(sim.clt.pacoteTotalMensalReal)}/mês
- **Nota fiscal PJ mínima equivalente (Anexo III c/ Fator R)**: ${formatBRL(sim.faturamentoPJEquivalente)}/mês
`,
        };
      }
    }
  }

  if (normalized.startsWith("/cnae/")) {
    const slug = normalized.replace("/cnae/", "");
    const cnae = getCNAEBySlug(slug);
    if (cnae) {
      const codigoPonto = cnae.codigoLimpo.replace(
        /^(\d{2})(\d{2})(\d)(\d{2})$/,
        "$1.$2-$3-$4"
      );
      return {
        status: 200,
        body: `# CNAE ${cnae.codigo} (${codigoPonto}) — ${cnae.titulo} (${cnae.nomePopular})

URL canônica: ${SITE_BASE_URL}/cnae/${cnae.slug}

- **Código IBGE / Sem máscara**: ${codigoPonto} / ${cnae.codigoLimpo}
- **Categoria**: ${cnae.categoria}
- **Anexo padrão Simples Nacional**: Anexo ${cnae.anexo} (${formatPercent(cnae.aliquotaInicialNominal, 1)} inicial)
- **Sujeito ao Fator R (28%)**: ${cnae.fatorR ? "Sim (pode migrar para Anexo III a partir de 6%)" : "Não"}
- **Permite MEI em 2026**: ${cnae.permiteMEI ? `Sim (limite ${formatBRL(TETO_ANUAL_MEI_2026)}/ano · DAS serviços ${formatBRL(DAS_MEI_SERVICOS_2026)}/mês)` : "Não permite MEI"}
- **Redução setorial CBS/IBS (Reforma Tributária)**: ${(cnae.reducaoIVA2026 * 100).toFixed(0)}%

## Orientação tributária 2026
${cnae.dicaTributaria2026}

## Atividades compreendidas
${cnae.atividadesCompreendidas.map((a) => `- ${a}`).join("\n")}
`,
      };
    }
  }

  return {
    status: 404,
    body: `# 404 — Página não encontrada no CalculaFiscal 2026

A rota solicitada (\`${normalized}\`) não existe ou foi movida.

Consulte o índice completo para agentes em [llms.txt](${SITE_BASE_URL}/llms.txt), o mapa oficial em [sitemap.xml](${SITE_BASE_URL}/sitemap.xml) ou acesse diretamente:
- [Comparador CLT vs PJ 2026](${SITE_BASE_URL}/clt-vs-pj)
- [Tabela CNAE 2026](${SITE_BASE_URL}/cnae)
- [Calculadora de Fator R](${SITE_BASE_URL}/calculadora-fator-r)
`,
  };
}
