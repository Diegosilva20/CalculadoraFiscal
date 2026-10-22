// Motor Oficial de Cálculos Trabalhistas, Tributários e Financeiros — CalculaFiscal 2026
// Todos os parâmetros e tabelas vêm da Fonte Única da Verdade: src/config/parametros-fiscais.json
import parametrosFiscais from "@/config/parametros-fiscais.json";

export type AnexoSimples = "I" | "II" | "III" | "IV" | "V";

export interface FaixaSimples {
  limiteSuperior: number;
  aliquotaNominal: number; // ex: 0.06 para 6%
  parcelaDeduzir: number;
}

export const PARAMETROS_FISCAIS = parametrosFiscais;

export const TABELAS_SIMPLES_2026: Record<AnexoSimples, FaixaSimples[]> =
  parametrosFiscais.pj.anexosSimplesNacional as Record<
    AnexoSimples,
    FaixaSimples[]
  >;

export const SALARIO_MINIMO_2026 = parametrosFiscais.trabalhista.salarioMinimo;
export const TETO_INSS_2026 = parametrosFiscais.trabalhista.tetoINSS;
export const DEDUCAO_DEPENDENTE_IR_2026 =
  parametrosFiscais.irpf.deducaoPorDependente;
export const DESCONTO_SIMPLIFICADO_IR_2026 =
  parametrosFiscais.irpf.descontoSimplificadoMensal;
export const TETO_ANUAL_MEI_2026 = parametrosFiscais.pj.tetoAnualMEI;

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals).replace(".", ",")}%`;
}

/**
 * Cálculo progressivo do INSS lendo diretamente as faixas de parametros-fiscais.json
 */
export function calculateINSS2026(salarioBruto: number): {
  valor: number;
  aliquotaEfetiva: number;
  faixas: { faixa: string; valor: number }[];
} {
  if (salarioBruto <= 0) {
    return { valor: 0, aliquotaEfetiva: 0, faixas: [] };
  }

  const faixasConfig = parametrosFiscais.trabalhista.faixasINSS;
  let total = 0;
  let limiteAnterior = 0;
  const faixas: { faixa: string; valor: number }[] = [];

  for (const f of faixasConfig) {
    if (salarioBruto > limiteAnterior) {
      const baseFaixa = Math.min(salarioBruto, f.ate) - limiteAnterior;
      const valorFaixa = baseFaixa * f.aliquota;
      total += valorFaixa;
      faixas.push({
        faixa: `Até ${formatBRL(f.ate)} (${formatPercent(f.aliquota, 1)})`,
        valor: valorFaixa,
      });
    }
    limiteAnterior = f.ate;
  }

  return {
    valor: Number(total.toFixed(2)),
    aliquotaEfetiva: salarioBruto > 0 ? total / salarioBruto : 0,
    faixas,
  };
}

/**
 * Cálculo do IRPF lendo diretamente os parâmetros de isenção (R$ 5.000) e faixas de parametros-fiscais.json
 */
export function calculateIRPF2026(
  salarioBruto: number,
  inss: number,
  dependentes = 0,
  outrasDeducoes = 0
): {
  valor: number;
  baseCalculo: number;
  aliquotaEfetiva: number;
  metodoDeducao: "simplificado" | "legal";
  isentoNovaRegra5k: boolean;
} {
  const {
    limiteIsencaoEfetivaMensal,
    limiteTransicaoRedutorMensal,
    faixasBaseCalculo,
  } = parametrosFiscais.irpf;

  if (salarioBruto <= 0) {
    return {
      valor: 0,
      baseCalculo: 0,
      aliquotaEfetiva: 0,
      metodoDeducao: "simplificado",
      isentoNovaRegra5k: true,
    };
  }

  if (salarioBruto <= limiteIsencaoEfetivaMensal) {
    return {
      valor: 0,
      baseCalculo: Math.max(0, salarioBruto - DESCONTO_SIMPLIFICADO_IR_2026),
      aliquotaEfetiva: 0,
      metodoDeducao: "simplificado",
      isentoNovaRegra5k: true,
    };
  }

  const deducaoLegal =
    inss + dependentes * DEDUCAO_DEPENDENTE_IR_2026 + outrasDeducoes;
  const usarSimplificado = DESCONTO_SIMPLIFICADO_IR_2026 > deducaoLegal;
  const deducaoEscolhida = usarSimplificado
    ? DESCONTO_SIMPLIFICADO_IR_2026
    : deducaoLegal;

  const base = Math.max(0, salarioBruto - deducaoEscolhida);

  const faixaEncontrada =
    faixasBaseCalculo.find((f) => base <= f.ate) ||
    faixasBaseCalculo[faixasBaseCalculo.length - 1];

  let impostoTabela = Math.max(
    0,
    base * faixaEncontrada.aliquota - faixaEncontrada.deducao
  );

  // Redutor gradual para salários na faixa de transição (ex: R$ 5.000,01 a R$ 7.000,00)
  if (
    salarioBruto > limiteIsencaoEfetivaMensal &&
    salarioBruto < limiteTransicaoRedutorMensal
  ) {
    const amplitude =
      limiteTransicaoRedutorMensal - limiteIsencaoEfetivaMensal;
    const fatorTransicao =
      (limiteTransicaoRedutorMensal - salarioBruto) / amplitude;
    const descontoRedutor = impostoTabela * (fatorTransicao * 0.65);
    impostoTabela = Math.max(0, impostoTabela - descontoRedutor);
  }

  return {
    valor: Number(impostoTabela.toFixed(2)),
    baseCalculo: Number(base.toFixed(2)),
    aliquotaEfetiva: salarioBruto > 0 ? impostoTabela / salarioBruto : 0,
    metodoDeducao: usarSimplificado ? "simplificado" : "legal",
    isentoNovaRegra5k: false,
  };
}

export interface SalarioLiquidoResult {
  salarioBruto: number;
  inss: number;
  irpf: number;
  valeTransporteDesconto: number;
  outrosDescontos: number;
  salarioLiquidoMensal: number;
  fgtsMensal: number;
  provisao13LiquidoMensal: number;
  provisaoFeriasLiquidoMensal: number;
  beneficiosLiquidos: number;
  pacoteTotalMensalReal: number;
  metodoIR: "simplificado" | "legal";
  isentoNovaRegra5k: boolean;
}

export function calculateSalarioLiquidoCLT(params: {
  salarioBruto: number;
  dependentes?: number;
  beneficiosMensais?: number;
  outrosDescontos?: number;
  descontarVT?: boolean;
}): SalarioLiquidoResult {
  const {
    salarioBruto,
    dependentes = 0,
    beneficiosMensais = 0,
    outrosDescontos = 0,
    descontarVT = false,
  } = params;

  const inssRes = calculateINSS2026(salarioBruto);
  const irpfRes = calculateIRPF2026(
    salarioBruto,
    inssRes.valor,
    dependentes,
    0
  );

  const vt = descontarVT ? salarioBruto * 0.06 : 0;
  const liquido = Math.max(
    0,
    salarioBruto - inssRes.valor - irpfRes.valor - vt - outrosDescontos
  );

  const fgtsMensal =
    salarioBruto * parametrosFiscais.trabalhista.aliquotaFGTS;
  const provisao13LiquidoMensal = liquido / 12;
  const tercoFeriasBrutoAnual = salarioBruto / 3;
  const provisaoFeriasLiquidoMensal = (tercoFeriasBrutoAnual * 0.85) / 12;

  const pacoteTotalMensalReal =
    liquido +
    fgtsMensal +
    provisao13LiquidoMensal +
    provisaoFeriasLiquidoMensal +
    beneficiosMensais;

  return {
    salarioBruto,
    inss: inssRes.valor,
    irpf: irpfRes.valor,
    valeTransporteDesconto: Number(vt.toFixed(2)),
    outrosDescontos,
    salarioLiquidoMensal: Number(liquido.toFixed(2)),
    fgtsMensal: Number(fgtsMensal.toFixed(2)),
    provisao13LiquidoMensal: Number(provisao13LiquidoMensal.toFixed(2)),
    provisaoFeriasLiquidoMensal: Number(provisaoFeriasLiquidoMensal.toFixed(2)),
    beneficiosLiquidos: beneficiosMensais,
    pacoteTotalMensalReal: Number(pacoteTotalMensalReal.toFixed(2)),
    metodoIR: irpfRes.metodoDeducao,
    isentoNovaRegra5k: irpfRes.isentoNovaRegra5k,
  };
}

export interface SimplesNacionalResult {
  faturamentoMensal: number;
  rbt12: number;
  anexoOriginal: AnexoSimples;
  anexoEfetivo: AnexoSimples;
  sujeitoFatorR: boolean;
  enquadrouFatorR: boolean;
  fatorRPercentual: number;
  aliquotaNominal: number;
  aliquotaEfetivaDAS: number;
  valorDAS: number;
  proLaboreSugerido: number;
  inssProLabore: number;
  irpfProLabore: number;
  custoContabilidade: number;
  totalImpostosECustos: number;
  lucroLiquidoIsento: number;
  cargaTributariaTotalPercentual: number;
  economiaMensalComFatorR: number;
  reformaTributaria: {
    aliquotaTeste2026: number;
    valorDestaqueNota2026: number;
    aliquotaEstimadaIVADual2027: number;
    valorEstimadoIVADual: number;
    reducaoSetorialPercentual: number;
  };
}

export function calculateSimplesNacional2026(params: {
  faturamentoMensal: number;
  rbt12?: number;
  anexo: AnexoSimples;
  sujeitoFatorR?: boolean;
  otimizarFatorR?: boolean;
  custoContabilidade?: number;
  reducaoSetorialIVA?: number;
}): SimplesNacionalResult {
  const {
    faturamentoMensal,
    rbt12 = faturamentoMensal * 12,
    anexo,
    sujeitoFatorR = anexo === "V",
    otimizarFatorR = true,
    custoContabilidade = 249,
    reducaoSetorialIVA = 0.3,
  } = params;

  const rbt12Efetivo = Math.max(rbt12, faturamentoMensal * 12, 1);
  const fatorRMinimo = parametrosFiscais.pj.fatorRMinimoFolha;

  const enquadrouFatorR = sujeitoFatorR && otimizarFatorR;
  const anexoEfetivo: AnexoSimples =
    sujeitoFatorR && enquadrouFatorR ? "III" : anexo;

  const proLaboreSugerido = enquadrouFatorR
    ? Math.max(SALARIO_MINIMO_2026, faturamentoMensal * fatorRMinimo)
    : SALARIO_MINIMO_2026;

  const fatorRPercentual =
    faturamentoMensal > 0 ? proLaboreSugerido / faturamentoMensal : 0;

  const calcAliquotaAnexo = (anx: AnexoSimples) => {
    const tabela = TABELAS_SIMPLES_2026[anx];
    const faixa =
      tabela.find((f) => rbt12Efetivo <= f.limiteSuperior) ||
      tabela[tabela.length - 1];
    const aliqEfetiva =
      (rbt12Efetivo * faixa.aliquotaNominal - faixa.parcelaDeduzir) /
      rbt12Efetivo;
    return {
      nominal: faixa.aliquotaNominal,
      efetiva: Math.max(0, aliqEfetiva),
    };
  };

  const { nominal, efetiva } = calcAliquotaAnexo(anexoEfetivo);
  const valorDAS = faturamentoMensal * efetiva;

  const aliqInssProLabore =
    parametrosFiscais.pj.aliquotaINSSProLaboreSimples;
  const baseInssProLabore = Math.min(proLaboreSugerido, TETO_INSS_2026);
  const inssProLabore = baseInssProLabore * aliqInssProLabore;
  const irpfProLabore = calculateIRPF2026(
    proLaboreSugerido,
    inssProLabore,
    0,
    0
  ).valor;

  const totalImpostosECustos =
    valorDAS + inssProLabore + irpfProLabore + custoContabilidade;
  const lucroLiquidoIsento = Math.max(
    0,
    faturamentoMensal - totalImpostosECustos
  );

  let economiaMensalComFatorR = 0;
  if (sujeitoFatorR) {
    const semFatorR = calcAliquotaAnexo("V");
    const dasAnexoV = faturamentoMensal * semFatorR.efetiva;
    const inssMinimo = SALARIO_MINIMO_2026 * aliqInssProLabore;
    const custoSemFatorR = dasAnexoV + inssMinimo;
    const custoComFatorR = valorDAS + inssProLabore + irpfProLabore;
    economiaMensalComFatorR = Math.max(0, custoSemFatorR - custoComFatorR);
  }

  const {
    aliquotaTesteCBS2026,
    aliquotaTesteIBS2026,
    aliquotaPadraoEstimadaIVADual,
  } = parametrosFiscais.pj.reformaTributaria;

  const aliquotaTesteTotal = aliquotaTesteCBS2026 + aliquotaTesteIBS2026;
  const aliquotaEstimadaIVADual2027 =
    aliquotaPadraoEstimadaIVADual * (1 - reducaoSetorialIVA);

  return {
    faturamentoMensal,
    rbt12: rbt12Efetivo,
    anexoOriginal: anexo,
    anexoEfetivo,
    sujeitoFatorR,
    enquadrouFatorR,
    fatorRPercentual,
    aliquotaNominal: nominal,
    aliquotaEfetivaDAS: efetiva,
    valorDAS: Number(valorDAS.toFixed(2)),
    proLaboreSugerido: Number(proLaboreSugerido.toFixed(2)),
    inssProLabore: Number(inssProLabore.toFixed(2)),
    irpfProLabore: Number(irpfProLabore.toFixed(2)),
    custoContabilidade,
    totalImpostosECustos: Number(totalImpostosECustos.toFixed(2)),
    lucroLiquidoIsento: Number(lucroLiquidoIsento.toFixed(2)),
    cargaTributariaTotalPercentual:
      faturamentoMensal > 0
        ? (valorDAS + inssProLabore + irpfProLabore) / faturamentoMensal
        : 0,
    economiaMensalComFatorR: Number(economiaMensalComFatorR.toFixed(2)),
    reformaTributaria: {
      aliquotaTeste2026: aliquotaTesteTotal,
      valorDestaqueNota2026: Number(
        (faturamentoMensal * aliquotaTesteTotal).toFixed(2)
      ),
      aliquotaEstimadaIVADual2027,
      valorEstimadoIVADual: Number(
        (faturamentoMensal * aliquotaEstimadaIVADual2027).toFixed(2)
      ),
      reducaoSetorialPercentual: reducaoSetorialIVA,
    },
  };
}

export interface CLTvsPJComparisonResult {
  clt: SalarioLiquidoResult;
  pj: SimplesNacionalResult;
  diferencaNoBolsoMensal: number;
  diferencaRealPatrimonial: number;
  faturamentoPJEquivalente: number;
  multiplicadorIdeal: number;
  veredito: "PJ_VANTAJOSO" | "CLT_VANTAJOSO" | "EMPATE_TECNICO";
}

export function calculateCLTvsPJ(params: {
  salarioBrutoCLT: number;
  faturamentoBrutoPJ: number;
  beneficiosCLT?: number;
  dependentes?: number;
  anexoPJ?: AnexoSimples;
  sujeitoFatorR?: boolean;
  custoContabilidade?: number;
}): CLTvsPJComparisonResult {
  const {
    salarioBrutoCLT,
    faturamentoBrutoPJ,
    beneficiosCLT = 850,
    dependentes = 0,
    anexoPJ = "III",
    sujeitoFatorR = true,
    custoContabilidade = 249,
  } = params;

  const clt = calculateSalarioLiquidoCLT({
    salarioBruto: salarioBrutoCLT,
    beneficiosMensais: beneficiosCLT,
    dependentes,
  });

  const pj = calculateSimplesNacional2026({
    faturamentoMensal: faturamentoBrutoPJ,
    anexo: anexoPJ,
    sujeitoFatorR,
    otimizarFatorR: true,
    custoContabilidade,
  });

  const diferencaNoBolsoMensal =
    pj.lucroLiquidoIsento - clt.salarioLiquidoMensal;
  const diferencaRealPatrimonial =
    pj.lucroLiquidoIsento - clt.pacoteTotalMensalReal;

  const taxaRetencaoLiquidaPJ = Math.max(
    0.65,
    1 - pj.cargaTributariaTotalPercentual
  );
  const faturamentoPJEquivalente =
    (clt.pacoteTotalMensalReal + custoContabilidade) / taxaRetencaoLiquidaPJ;

  const multiplicadorIdeal =
    salarioBrutoCLT > 0 ? faturamentoPJEquivalente / salarioBrutoCLT : 1.4;

  let veredito: "PJ_VANTAJOSO" | "CLT_VANTAJOSO" | "EMPATE_TECNICO" =
    "EMPATE_TECNICO";
  if (diferencaRealPatrimonial > 350) {
    veredito = "PJ_VANTAJOSO";
  } else if (diferencaRealPatrimonial < -200) {
    veredito = "CLT_VANTAJOSO";
  }

  return {
    clt,
    pj,
    diferencaNoBolsoMensal: Number(diferencaNoBolsoMensal.toFixed(2)),
    diferencaRealPatrimonial: Number(diferencaRealPatrimonial.toFixed(2)),
    faturamentoPJEquivalente: Number(faturamentoPJEquivalente.toFixed(2)),
    multiplicadorIdeal: Number(multiplicadorIdeal.toFixed(2)),
    veredito,
  };
}

export type MotivoRescisao =
  | "sem_justa_causa"
  | "pedido_demissao"
  | "acordo_comum"
  | "justa_causa";

export function calculateRescisaoCLT(params: {
  salarioBruto: number;
  mesesTrabalhados: number;
  diasTrabalhadosNoMes: number;
  motivo: MotivoRescisao;
  feriasVencidas: boolean;
  avisoPrevioIndenizado: boolean;
}) {
  const {
    salarioBruto,
    mesesTrabalhados,
    diasTrabalhadosNoMes,
    motivo,
    feriasVencidas,
    avisoPrevioIndenizado,
  } = params;

  const saldoSalario = (salarioBruto / 30) * Math.min(30, diasTrabalhadosNoMes);
  const anosCompletos = Math.floor(mesesTrabalhados / 12);
  const mesesNoAnoAtual = mesesTrabalhados % 12 || 1;

  const decimoTerceiroProporcional =
    motivo === "justa_causa" ? 0 : (salarioBruto / 12) * mesesNoAnoAtual;

  const feriasProporcionais =
    motivo === "justa_causa" ? 0 : (salarioBruto / 12) * mesesNoAnoAtual;
  const tercoFeriasProporcionais = feriasProporcionais / 3;

  const valorFeriasVencidas = feriasVencidas ? salarioBruto * (4 / 3) : 0;

  const diasAviso = Math.min(90, 30 + anosCompletos * 3);
  let valorAvisoPrevio = 0;
  if (avisoPrevioIndenizado) {
    if (motivo === "sem_justa_causa") {
      valorAvisoPrevio = (salarioBruto / 30) * diasAviso;
    } else if (motivo === "acordo_comum") {
      valorAvisoPrevio = ((salarioBruto / 30) * diasAviso) / 2;
    }
  }

  const saldoFGTSEstimado =
    salarioBruto *
    parametrosFiscais.trabalhista.aliquotaFGTS *
    mesesTrabalhados;
  let multaFGTS = 0;
  let saqueFGTSLiberado = 0;

  if (motivo === "sem_justa_causa") {
    multaFGTS = saldoFGTSEstimado * 0.4;
    saqueFGTSLiberado = saldoFGTSEstimado + multaFGTS;
  } else if (motivo === "acordo_comum") {
    multaFGTS = saldoFGTSEstimado * 0.2;
    saqueFGTSLiberado = saldoFGTSEstimado * 0.8 + multaFGTS;
  }

  const inssSaldo = calculateINSS2026(saldoSalario).valor;
  const inss13 = calculateINSS2026(decimoTerceiroProporcional).valor;
  const totalDescontos = inssSaldo + inss13;

  const totalRescisaoEmConta =
    saldoSalario +
    decimoTerceiroProporcional +
    feriasProporcionais +
    tercoFeriasProporcionais +
    valorFeriasVencidas +
    valorAvisoPrevio -
    totalDescontos;

  return {
    saldoSalario: Number(saldoSalario.toFixed(2)),
    decimoTerceiroProporcional: Number(decimoTerceiroProporcional.toFixed(2)),
    feriasProporcionaisComTerco: Number(
      (feriasProporcionais + tercoFeriasProporcionais).toFixed(2)
    ),
    valorFeriasVencidas: Number(valorFeriasVencidas.toFixed(2)),
    valorAvisoPrevio: Number(valorAvisoPrevio.toFixed(2)),
    saldoFGTSEstimado: Number(saldoFGTSEstimado.toFixed(2)),
    multaFGTS: Number(multaFGTS.toFixed(2)),
    saqueFGTSLiberado: Number(saqueFGTSLiberado.toFixed(2)),
    totalDescontos: Number(totalDescontos.toFixed(2)),
    totalRescisaoEmConta: Number(Math.max(0, totalRescisaoEmConta).toFixed(2)),
    totalGeralComFGTS: Number(
      Math.max(0, totalRescisaoEmConta + saqueFGTSLiberado).toFixed(2)
    ),
  };
}

export function calculateFeriasCLT(params: {
  salarioBruto: number;
  diasFerias: number;
  venderDezDias: boolean;
  adiantarPrimeiraParcela13: boolean;
}) {
  const {
    salarioBruto,
    diasFerias,
    venderDezDias,
    adiantarPrimeiraParcela13,
  } = params;

  const valorFeriasBruto = (salarioBruto / 30) * diasFerias;
  const tercoConstitucional = valorFeriasBruto / 3;
  const baseTributavel = valorFeriasBruto + tercoConstitucional;

  const abonoPecuniario = venderDezDias
    ? (salarioBruto / 30) * 10 * (4 / 3)
    : 0;
  const adiantamento13 = adiantarPrimeiraParcela13 ? salarioBruto / 2 : 0;

  const inss = calculateINSS2026(baseTributavel).valor;
  const irpf = calculateIRPF2026(baseTributavel, inss, 0, 0).valor;

  const liquidoReceber =
    baseTributavel - inss - irpf + abonoPecuniario + adiantamento13;

  return {
    valorFeriasBruto: Number(valorFeriasBruto.toFixed(2)),
    tercoConstitucional: Number(tercoConstitucional.toFixed(2)),
    abonoPecuniario: Number(abonoPecuniario.toFixed(2)),
    adiantamento13: Number(adiantamento13.toFixed(2)),
    inss: Number(inss.toFixed(2)),
    irpf: Number(irpf.toFixed(2)),
    liquidoReceber: Number(liquidoReceber.toFixed(2)),
  };
}
