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
export const TETO_ANUAL_MEI_2026 = parametrosFaiscaisCheck();

function parametrosFaiscaisCheck() {
  return parametrosFiscais.pj.tetoAnualMEI;
}

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
  if (!Number.isFinite(salarioBruto) || salarioBruto <= 0) {
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
        valor: Number(valorFaixa.toFixed(2)),
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
 * Cálculo do IRPF lendo diretamente os parâmetros de isenção (R$ 5.000) e faixas de parametros-fiscais.json.
 * Aplica redutor linear suave entre R$ 5.000,01 e R$ 7.000,00 sem degraus abruptos.
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

  if (!Number.isFinite(salarioBruto) || salarioBruto <= 0) {
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
    inss + Math.max(0, dependentes) * DEDUCAO_DEPENDENTE_IR_2026 + Math.max(0, outrasDeducoes);
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

  // Redutor gradual linear de 100% (em R$ 5.000) até 0% (em R$ 7.000)
  if (
    salarioBruto > limiteIsencaoEfetivaMensal &&
    salarioBruto < limiteTransicaoRedutorMensal
  ) {
    const amplitude =
      limiteTransicaoRedutorMensal - limiteIsencaoEfetivaMensal;
    const fatorTransicao =
      (limiteTransicaoRedutorMensal - salarioBruto) / amplitude;
    const descontoRedutor = impostoTabela * Math.max(0, Math.min(1, fatorTransicao));
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

  const bruto = Math.max(0, Number.isFinite(salarioBruto) ? salarioBruto : 0);
  const benef = Math.max(0, Number.isFinite(beneficiosMensais) ? beneficiosMensais : 0);
  const outros = Math.max(0, Number.isFinite(outrosDescontos) ? outrosDescontos : 0);

  const inssRes = calculateINSS2026(bruto);
  const irpfRes = calculateIRPF2026(bruto, inssRes.valor, dependentes, 0);

  const vt = descontarVT ? bruto * 0.06 : 0;
  const liquido = Math.max(0, bruto - inssRes.valor - irpfRes.valor - vt - outros);

  const fgtsMensal = bruto * parametrosFiscais.trabalhista.aliquotaFGTS;
  const provisao13LiquidoMensal = liquido / 12;
  const tercoFeriasBrutoAnual = bruto / 3;
  const provisaoFeriasLiquidoMensal = (tercoFeriasBrutoAnual * 0.85) / 12;

  const pacoteTotalMensalReal =
    liquido +
    fgtsMensal +
    provisao13LiquidoMensal +
    provisaoFeriasLiquidoMensal +
    benef;

  return {
    salarioBruto: bruto,
    inss: inssRes.valor,
    irpf: irpfRes.valor,
    valeTransporteDesconto: Number(vt.toFixed(2)),
    outrosDescontos: outros,
    salarioLiquidoMensal: Number(liquido.toFixed(2)),
    fgtsMensal: Number(fgtsMensal.toFixed(2)),
    provisao13LiquidoMensal: Number(provisao13LiquidoMensal.toFixed(2)),
    provisaoFeriasLiquidoMensal: Number(provisaoFeriasLiquidoMensal.toFixed(2)),
    beneficiosLiquidos: benef,
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
  cppPatronalAnexoIV: number;
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

  const fat = Math.max(0, Number.isFinite(faturamentoMensal) ? faturamentoMensal : 0);
  const contab = Math.max(0, Number.isFinite(custoContabilidade) ? custoContabilidade : 0);
  const rbt12Efetivo = Math.max(rbt12, fat * 12, 1);
  const fatorRMinimo = parametrosFiscais.pj.fatorRMinimoFolha;

  // Só ativa Fator R se a atividade for sujeita (ou configurada para Fator R) E otimizarFatorR estiver ligado
  const enquadrouFatorR = sujeitoFatorR && otimizarFatorR && (anexo === "V" || anexo === "III");
  const anexoEfetivo: AnexoSimples = enquadrouFatorR ? "III" : anexo;

  const proLaboreSugerido = enquadrouFatorR
    ? Math.max(SALARIO_MINIMO_2026, fat * fatorRMinimo)
    : fat > 0
    ? SALARIO_MINIMO_2026
    : 0;

  const fatorRPercentual = fat > 0 ? proLaboreSugerido / fat : 0;

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
  const valorDAS = fat * efetiva;

  const aliqInssProLabore = parametrosFiscais.pj.aliquotaINSSProLaboreSimples;
  const baseInssProLabore = Math.min(proLaboreSugerido, TETO_INSS_2026);
  const inssProLabore = baseInssProLabore * aliqInssProLabore;

  // No Anexo IV (Advocacia, Construção, Vigilância, Limpeza), a CPP de 20% não entra no DAS e é paga à parte sobre o pró-labore/folha
  const cppPatronalAnexoIV =
    anexoEfetivo === "IV" ? proLaboreSugerido * 0.2 : 0;

  const irpfProLabore = calculateIRPF2026(
    proLaboreSugerido,
    inssProLabore,
    0,
    0
  ).valor;

  const totalTributosSemContab =
    valorDAS + inssProLabore + cppPatronalAnexoIV + irpfProLabore;
  const totalImpostosECustos = totalTributosSemContab + (fat > 0 ? contab : 0);
  const lucroLiquidoIsento = Math.max(0, fat - totalImpostosECustos);

  let economiaMensalComFatorR = 0;
  if (enquadrouFatorR && fat > 0) {
    const semFatorR = calcAliquotaAnexo("V");
    const dasAnexoV = fat * semFatorR.efetiva;
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
    faturamentoMensal: fat,
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
    cppPatronalAnexoIV: Number(cppPatronalAnexoIV.toFixed(2)),
    irpfProLabore: Number(irpfProLabore.toFixed(2)),
    custoContabilidade: fat > 0 ? contab : 0,
    totalImpostosECustos: Number(totalImpostosECustos.toFixed(2)),
    lucroLiquidoIsento: Number(lucroLiquidoIsento.toFixed(2)),
    cargaTributariaTotalPercentual: fat > 0 ? totalTributosSemContab / fat : 0,
    economiaMensalComFatorR: Number(economiaMensalComFatorR.toFixed(2)),
    reformaTributaria: {
      aliquotaTeste2026: aliquotaTesteTotal,
      valorDestaqueNota2026: Number((fat * aliquotaTesteTotal).toFixed(2)),
      aliquotaEstimadaIVADual2027,
      valorEstimadoIVADual: Number((fat * aliquotaEstimadaIVADual2027).toFixed(2)),
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
  otimizarFatorR?: boolean;
  custoContabilidade?: number;
}): CLTvsPJComparisonResult {
  const {
    salarioBrutoCLT,
    faturamentoBrutoPJ,
    beneficiosCLT = 850,
    dependentes = 0,
    anexoPJ = "III",
    sujeitoFatorR = true,
    otimizarFatorR,
    custoContabilidade = 249,
  } = params;

  const clt = calculateSalarioLiquidoCLT({
    salarioBruto: salarioBrutoCLT,
    beneficiosMensais: beneficiosCLT,
    dependentes,
  });

  // Se o chamador passou otimizarFatorR explicitamente, respeita; caso contrário, só aplica Fator R se sujeitoFatorR for true
  const aplicarFatorR = otimizarFatorR !== undefined ? otimizarFatorR : sujeitoFatorR;

  const pj = calculateSimplesNacional2026({
    faturamentoMensal: faturamentoBrutoPJ,
    anexo: anexoPJ,
    sujeitoFatorR,
    otimizarFatorR: aplicarFatorR,
    custoContabilidade,
  });

  const diferencaNoBolsoMensal =
    pj.lucroLiquidoIsento - clt.salarioLiquidoMensal;
  const diferencaRealPatrimonial =
    pj.lucroLiquidoIsento - clt.pacoteTotalMensalReal;

  const taxaRetencaoLiquidaPJ = Math.max(
    0.55,
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

  const bruto = Math.max(0, Number.isFinite(salarioBruto) ? salarioBruto : 0);
  const meses = Math.max(1, Math.round(Number.isFinite(mesesTrabalhados) ? mesesTrabalhados : 1));
  const diasMes = Math.max(0, Math.min(30, Number.isFinite(diasTrabalhadosNoMes) ? diasTrabalhadosNoMes : 0));

  const saldoSalario = (bruto / 30) * diasMes;
  const anosCompletos = Math.floor(meses / 12);
  // Ao completar múltiplo exato de 12 meses (ex: 12 ou 24), considera 12/12 no ciclo vigente em vez de 1/12
  const restoMeses = meses % 12;
  const mesesProporcionais = restoMeses === 0 ? 12 : restoMeses;

  const decimoTerceiroProporcional =
    motivo === "justa_causa" ? 0 : (bruto / 12) * mesesProporcionais;

  const feriasProporcionais =
    motivo === "justa_causa" ? 0 : (bruto / 12) * mesesProporcionais;
  const tercoFeriasProporcionais = feriasProporcionais / 3;

  const valorFeriasVencidas = feriasVencidas ? bruto * (4 / 3) : 0;

  const diasAviso =
    motivo === "sem_justa_causa" || motivo === "acordo_comum"
      ? Math.min(90, 30 + anosCompletos * 3)
      : 0;
  let valorAvisoPrevio = 0;
  if (avisoPrevioIndenizado) {
    if (motivo === "sem_justa_causa") {
      valorAvisoPrevio = (bruto / 30) * diasAviso;
    } else if (motivo === "acordo_comum") {
      valorAvisoPrevio = ((bruto / 30) * diasAviso) / 2;
    }
  }

  const saldoFGTSEstimado =
    bruto * parametrosFiscais.trabalhista.aliquotaFGTS * meses;
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
  const irpfSaldo = calculateIRPF2026(saldoSalario, inssSaldo, 0, 0).valor;
  const inss13 = calculateINSS2026(decimoTerceiroProporcional).valor;
  const irpf13 = calculateIRPF2026(decimoTerceiroProporcional, inss13, 0, 0).valor;

  const totalDescontos = inssSaldo + irpfSaldo + inss13 + irpf13;

  const totalRescisaoEmConta =
    saldoSalario +
    decimoTerceiroProporcional +
    feriasProporcionais +
    tercoFeriasProporcionais +
    valorFeriasVencidas +
    valorAvisoPrevio -
    totalDescontos;

  return {
    diasAviso,
    mesesProporcionais,
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
    inssDescontado: Number((inssSaldo + inss13).toFixed(2)),
    irpfDescontado: Number((irpfSaldo + irpf13).toFixed(2)),
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

  const bruto = Math.max(0, Number.isFinite(salarioBruto) ? salarioBruto : 0);
  const valorFeriasBruto = (bruto / 30) * diasFerias;
  const tercoConstitucional = valorFeriasBruto / 3;
  const baseTributavel = valorFeriasBruto + tercoConstitucional;

  const abonoPecuniario = venderDezDias ? (bruto / 30) * 10 * (4 / 3) : 0;
  const adiantamento13 = adiantarPrimeiraParcela13 ? bruto / 2 : 0;

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
