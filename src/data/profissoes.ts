import { AnexoSimples } from "@/lib/calculators";

export interface ProfissaoSEO {
  slug: string;
  nome: string;
  tituloSEO: string;
  salarioMedioCLT: number;
  propostaMediaPJ: number;
  beneficiosMediosCLT: number;
  cnaeRecomendadoCodigo: string;
  cnaeRecomendadoSlug: string;
  anexoPadrao: AnexoSimples;
  sujeitoFatorR: boolean;
  resumoMercado2026: string;
}

export const PROFISSOES_SEO: ProfissaoSEO[] = [
  {
    slug: "desenvolvedor-de-software",
    nome: "Desenvolvedor de Software / Programador",
    tituloSEO: "Calculadora CLT vs PJ para Desenvolvedor e Programador (2026)",
    salarioMedioCLT: 9500,
    propostaMediaPJ: 14500,
    beneficiosMediosCLT: 1200,
    cnaeRecomendadoCodigo: "6201-5/01",
    cnaeRecomendadoSlug: "6201-5-01-desenvolvimento-de-programas-de-computador-sob-encomenda",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Em 2026, desenvolvedores Pleno e Sênior conseguem reduzir a alíquota do CNPJ para 6% usando o Fator R (Anexo III) ou até menos quando prestam serviços de suporte/infraestrutura (CNAE 6209-1/00).",
  },
  {
    slug: "engenheiro-de-dados-e-ia",
    nome: "Engenheiro de Dados, Cientista de Dados e Especialista em IA",
    tituloSEO: "Calculadora CLT vs PJ para Engenheiro de Dados e IA (2026)",
    salarioMedioCLT: 14000,
    propostaMediaPJ: 21000,
    beneficiosMediosCLT: 1500,
    cnaeRecomendadoCodigo: "6204-0/00",
    cnaeRecomendadoSlug: "6204-0-00-consultoria-em-tecnologia-da-informacao",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Com salários acima de R$ 12.000, a alíquota de 27,5% de IRPF na CLT retém mais de R$ 35.000/ano. No CNPJ com Fator R (6%), a economia mensal supera R$ 3.200.",
  },
  {
    slug: "devops-e-arquitetura-cloud",
    nome: "Engenheiro DevOps, SRE e Arquiteto Cloud",
    tituloSEO: "Calculadora CLT vs PJ para DevOps, SRE e Cloud (2026)",
    salarioMedioCLT: 13000,
    propostaMediaPJ: 19500,
    beneficiosMediosCLT: 1400,
    cnaeRecomendadoCodigo: "6209-1/00",
    cnaeRecomendadoSlug: "6209-1-00-suporte-tecnico-manutencao-e-outros-servicos-em-ti",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "Profissionais de infraestrutura, SRE e Cloud que utilizam o CNAE 6209-1/00 ou 6311-9/00 entram diretamente no Anexo III (6%) sem sequer precisar de Fator R.",
  },
  {
    slug: "medico-plantonista",
    nome: "Médico (Plantonista e Clínico)",
    tituloSEO: "Calculadora CLT vs PJ para Médicos e Plantonistas (2026)",
    salarioMedioCLT: 16000,
    propostaMediaPJ: 24000,
    beneficiosMediosCLT: 900,
    cnaeRecomendadoCodigo: "8630-5/03",
    cnaeRecomendadoSlug: "8630-5-03-atividade-medica-ambulatorial-restrita-a-consultas",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Médicos que atuam via CNPJ com Fator R (Anexo III) economizam mais de R$ 35.000 por ano em comparação ao vínculo CLT ou Pessoa Física (27,5% de IR), além de contarem com redução de 60% na Reforma Tributária.",
  },
  {
    slug: "dentista-e-odontologo",
    nome: "Cirurgião-Dentista e Odontólogo",
    tituloSEO: "Calculadora CLT vs PJ para Dentistas e Odontólogos (2026)",
    salarioMedioCLT: 7500,
    propostaMediaPJ: 12000,
    beneficiosMediosCLT: 700,
    cnaeRecomendadoCodigo: "8630-5/04",
    cnaeRecomendadoSlug: "8630-5-04-atividade-odontologica",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Dentistas que atendem em clínicas parceiras como PJ no Simples Nacional (com Fator R de 28%) pagam apenas 6% de imposto sobre as notas fiscais.",
  },
  {
    slug: "enfermeiro-hospitalar-e-auditor",
    nome: "Enfermeiro (Hospitalar, Auditoria e Home Care)",
    tituloSEO: "Calculadora CLT vs PJ para Enfermeiros (2026)",
    salarioMedioCLT: 5200,
    propostaMediaPJ: 8200,
    beneficiosMediosCLT: 750,
    cnaeRecomendadoCodigo: "8650-0/01",
    cnaeRecomendadoSlug: "8650-0-01-atividades-de-enfermagem",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Com a nova isenção de IRPF até R$ 5.000 na CLT em 2026, o enfermeiro precisa exigir pelo menos 1,45x o salário bruto para que uma proposta PJ em Home Care ou Auditoria compense os benefícios.",
  },
  {
    slug: "fisioterapeuta-e-pilates",
    nome: "Fisioterapeuta e Instrutor de Pilates",
    tituloSEO: "Calculadora CLT vs PJ para Fisioterapeutas (2026)",
    salarioMedioCLT: 4800,
    propostaMediaPJ: 7500,
    beneficiosMediosCLT: 650,
    cnaeRecomendadoCodigo: "8650-0/04",
    cnaeRecomendadoSlug: "8650-0-04-atividades-de-fisioterapia",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "A fisioterapia (CNAE 8650-0/04) é tributada diretamente no Anexo III (6% inicial sem exigir Fator R), garantindo uma das menores cargas tributárias da área da saúde.",
  },
  {
    slug: "nutricionista-clinico-e-esportivo",
    nome: "Nutricionista Clínico, Esportivo e RT",
    tituloSEO: "Calculadora CLT vs PJ para Nutricionistas (2026)",
    salarioMedioCLT: 4600,
    propostaMediaPJ: 7200,
    beneficiosMediosCLT: 650,
    cnaeRecomendadoCodigo: "8650-0/02",
    cnaeRecomendadoSlug: "8650-0-02-atividades-de-profissionais-da-nutricao",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Nutricionistas que prestam consultoria e atendimento clínico via CNPJ reduzem a alíquota do Simples de 15,5% para 6% calibrando o pró-labore em 28% (Fator R).",
  },
  {
    slug: "psicologo-e-terapeuta",
    nome: "Psicólogo Clínico e Organizacional",
    tituloSEO: "Calculadora CLT vs PJ para Psicólogos (2026)",
    salarioMedioCLT: 5000,
    propostaMediaPJ: 8000,
    beneficiosMediosCLT: 700,
    cnaeRecomendadoCodigo: "8650-0/03",
    cnaeRecomendadoSlug: "8650-0-03-atividades-de-psicologia-e-psicanalise",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Com a explosão das plataformas de terapia online e convênios em 2026, abrir CNPJ no Simples Nacional com Fator R reduz o imposto para 6%.",
  },
  {
    slug: "engenheiro-civil-e-projetos",
    nome: "Engenheiro (Civil, Produção, Elétrica e Projetos)",
    tituloSEO: "Calculadora CLT vs PJ para Engenheiros (2026)",
    salarioMedioCLT: 10500,
    propostaMediaPJ: 15500,
    beneficiosMediosCLT: 1100,
    cnaeRecomendadoCodigo: "7112-0/00",
    cnaeRecomendadoSlug: "7112-0-00-servicos-de-engenharia",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Com a alta demanda de infraestrutura e energia em 2026, construtoras contratam engenheiros via PJ (CNAE 7112-0/00). Com o Fator R calibrado em 28%, o imposto cai de 15,5% para 6% no Simples Nacional.",
  },
  {
    slug: "engenheiro-seguranca-do-trabalho",
    nome: "Engenheiro e Especialista em Segurança do Trabalho (SST)",
    tituloSEO: "Calculadora CLT vs PJ para Engenheiro de Segurança do Trabalho (2026)",
    salarioMedioCLT: 9200,
    propostaMediaPJ: 14000,
    beneficiosMediosCLT: 1000,
    cnaeRecomendadoCodigo: "7119-7/04",
    cnaeRecomendadoSlug: "7119-7-04-servicos-de-pericia-tecnica-relacionados-a-seguranca-do-trabalho",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "A emissão de laudos PGR, LTCAT e gestão de eSocial SST como PJ permite atender múltiplas empresas simultaneamente pagando apenas 6% no Anexo III via Fator R.",
  },
  {
    slug: "arquiteto-e-urbanista",
    nome: "Arquiteto e Urbanista",
    tituloSEO: "Calculadora CLT vs PJ para Arquitetos (2026)",
    salarioMedioCLT: 7000,
    propostaMediaPJ: 10500,
    beneficiosMediosCLT: 850,
    cnaeRecomendadoCodigo: "7111-1/00",
    cnaeRecomendadoSlug: "7111-1-00-servicos-de-arquitetura",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "Arquitetos têm uma das melhores tributações PJ do Brasil: o CNAE 7111-1/00 entra direto no Anexo III (6% inicial) sem precisar de Fator R.",
  },
  {
    slug: "projetista-bim-e-cad",
    nome: "Projetista BIM / Revit / AutoCAD",
    tituloSEO: "Calculadora CLT vs PJ para Projetista BIM e CAD (2026)",
    salarioMedioCLT: 5800,
    propostaMediaPJ: 8800,
    beneficiosMediosCLT: 800,
    cnaeRecomendadoCodigo: "7119-7/03",
    cnaeRecomendadoSlug: "7119-7-03-servicos-de-desenho-tecnico-relacionados-a-arquitetura-e-engenharia",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Modeladores BIM e projetistas terceirizados por construtoras utilizam o Fator R para tributar em 6% no Anexo III do Simples Nacional.",
  },
  {
    slug: "analista-de-marketing-e-trafego",
    nome: "Especialista em Marketing Digital e Tráfego Pago",
    tituloSEO: "Calculadora CLT vs PJ para Marketing Digital e Gestor de Tráfego (2026)",
    salarioMedioCLT: 5500,
    propostaMediaPJ: 8500,
    beneficiosMediosCLT: 750,
    cnaeRecomendadoCodigo: "7319-0/02",
    cnaeRecomendadoSlug: "7319-0-02-promocao-de-vendas",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "Profissionais de marketing, copywriters e gestores de tráfego podem começar como MEI (até R$ 6.750/mês) ou Microempresa no Anexo III pagando apenas 6%.",
  },
  {
    slug: "designer-ux-ui-e-produto",
    nome: "Product Designer (UI/UX) e Designer Gráfico",
    tituloSEO: "Calculadora CLT vs PJ para Product Designer UI/UX (2026)",
    salarioMedioCLT: 7800,
    propostaMediaPJ: 11800,
    beneficiosMediosCLT: 1000,
    cnaeRecomendadoCodigo: "7410-2/03",
    cnaeRecomendadoSlug: "7410-2-03-design-de-produto-e-design-grafico",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Product Designers e UX/UI contratados por empresas de tecnologia utilizam o Fator R para tributar em 6% no Anexo III e aumentar a renda líquida mensal.",
  },
  {
    slug: "editor-de-video-e-motion-designer",
    nome: "Editor de Vídeo, Videomaker e Motion Designer",
    tituloSEO: "Calculadora CLT vs PJ para Editor de Vídeo e Motion Designer (2026)",
    salarioMedioCLT: 4500,
    propostaMediaPJ: 7000,
    beneficiosMediosCLT: 650,
    cnaeRecomendadoCodigo: "5912-0/99",
    cnaeRecomendadoSlug: "5912-0-99-atividades-de-pos-producao-cinematografica-edicao-de-video",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "Editores de vídeo e motion designers podem ser MEI até R$ 81 mil/ano e, ao migrarem para ME, pagam apenas 6% direto no Anexo III sem precisar de Fator R.",
  },
  {
    slug: "representante-comercial-e-vendas",
    nome: "Representante Comercial / Executivo de Vendas B2B",
    tituloSEO: "Calculadora CLT vs PJ para Representante Comercial e Vendas (2026)",
    salarioMedioCLT: 6500,
    propostaMediaPJ: 11000,
    beneficiosMediosCLT: 800,
    cnaeRecomendadoCodigo: "4619-2/00",
    cnaeRecomendadoSlug: "4619-2-00-representantes-comerciais-e-agentes-do-comercio",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Executivos de contas (Closers, SDRs e Representantes Comerciais) com comissões variáveis têm enorme ganho líquido no modelo PJ com Fator R.",
  },
  {
    slug: "consultor-empresarial-e-pm",
    nome: "Consultor Empresarial, Financeiro e Product Manager (PM)",
    tituloSEO: "Calculadora CLT vs PJ para Consultores e Product Managers (2026)",
    salarioMedioCLT: 12000,
    propostaMediaPJ: 18000,
    beneficiosMediosCLT: 1400,
    cnaeRecomendadoCodigo: "7020-4/00",
    cnaeRecomendadoSlug: "7020-4-00-atividades-de-consultoria-em-gestao-empresarial",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Para salários acima de R$ 10.000, o desconto de 27,5% do IRPF na CLT consome grande parte da renda. Como PJ no Anexo III (via Fator R), a economia anual passa de R$ 25.000.",
  },
  {
    slug: "advogado-associado",
    nome: "Advogado Associado / Sociedade Unipessoal de Advocacia",
    tituloSEO: "Calculadora CLT vs PJ para Advogados (Anexo IV 4,5% em 2026)",
    salarioMedioCLT: 7500,
    propostaMediaPJ: 11000,
    beneficiosMediosCLT: 900,
    cnaeRecomendadoCodigo: "6911-7/01",
    cnaeRecomendadoSlug: "6911-7-01-servicos-advocaticios",
    anexoPadrao: "IV",
    sujeitoFatorR: false,
    resumoMercado2026:
      "A Sociedade Individual de Advocacia inicia com alíquota de apenas 4,5% no Anexo IV do Simples Nacional, tornando a atuação PJ imbatível.",
  },
  {
    slug: "contador-e-consultor-fiscal",
    nome: "Contador, Analista Fiscal e Auditor Contábil",
    tituloSEO: "Calculadora CLT vs PJ para Contadores e Analistas Fiscais (2026)",
    salarioMedioCLT: 6800,
    propostaMediaPJ: 10200,
    beneficiosMediosCLT: 850,
    cnaeRecomendadoCodigo: "6920-6/01",
    cnaeRecomendadoSlug: "6920-6-01-atividades-de-contabilidade",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "O CNAE de contabilidade (6920-6/01) entra diretamente no Anexo III (6% inicial sem Fator R) e conta com 30% de redução na alíquota do IVA Dual da Reforma Tributária.",
  },
  {
    slug: "corretor-de-imoveis",
    nome: "Corretor de Imóveis e Avaliador Imobiliário (CRECI)",
    tituloSEO: "Calculadora CLT vs PJ para Corretor de Imóveis (2026)",
    salarioMedioCLT: 6000,
    propostaMediaPJ: 10000,
    beneficiosMediosCLT: 600,
    cnaeRecomendadoCodigo: "6821-8/01",
    cnaeRecomendadoSlug: "6821-8-01-corretagem-na-compra-e-venda-e-avaliacao-de-imoveis",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "Corretores com CNPJ próprio (CNAE 6821-8/01) pagam a partir de 6% no Anexo III sobre as comissões de construtoras e imobiliárias, em vez de 27,5% na pessoa física.",
  },
  {
    slug: "assistente-administrativo-e-bpo",
    nome: "Assistente Administrativo, Executivo e BPO Financeiro",
    tituloSEO: "Calculadora CLT vs PJ para Assistente Administrativo e BPO (2026)",
    salarioMedioCLT: 3800,
    propostaMediaPJ: 5800,
    beneficiosMediosCLT: 650,
    cnaeRecomendadoCodigo: "8211-3/00",
    cnaeRecomendadoSlug: "8211-3-00-servicos-combinados-de-escritorio-e-apoio-administrativo",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "Por permitir enquadramento como MEI (imposto fixo de ~R$ 86/mês até R$ 6.750 mensais), o CNAE 8211-3/00 oferece altíssima retenção líquida para profissionais administrativos remotos.",
  },
  {
    slug: "personal-trainer-e-educador-fisico",
    nome: "Personal Trainer e Profissional de Educação Física",
    tituloSEO: "Calculadora CLT vs PJ para Personal Trainer (2026)",
    salarioMedioCLT: 4200,
    propostaMediaPJ: 6800,
    beneficiosMediosCLT: 550,
    cnaeRecomendadoCodigo: "8591-1/00",
    cnaeRecomendadoSlug: "8591-1-00-ensino-de-esportes-personal-trainer",
    anexoPadrao: "V",
    sujeitoFatorR: true,
    resumoMercado2026:
      "Personal trainers e assessorias esportivas que emitem nota fiscal utilizam o Fator R (28% de pró-labore) para pagar apenas 6% no Anexo III.",
  },
  {
    slug: "professor-de-ingles-e-idiomas",
    nome: "Professor de Inglês, Idiomas e Mentor Online",
    tituloSEO: "Calculadora CLT vs PJ para Professores e Mentores (2026)",
    salarioMedioCLT: 4500,
    propostaMediaPJ: 6800,
    beneficiosMediosCLT: 600,
    cnaeRecomendadoCodigo: "8593-7/00",
    cnaeRecomendadoSlug: "8593-7-00-ensino-de-idiomas",
    anexoPadrao: "III",
    sujeitoFatorR: false,
    resumoMercado2026:
      "O ensino de idiomas e treinamentos livres permite ser MEI e, no Simples Nacional, entra direto no Anexo III (6%) com 60% de desconto na Reforma Tributária.",
  },
];

// +95 Faixas salariais programáticas (de R$ 1.750 até R$ 50.000) para cobrir 100% das buscas de cauda longa no Google
export const FAIXAS_SALARIAIS_SEO: number[] = [
  1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750,
  5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000,
  8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10500, 11000, 11500, 12000,
  12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500,
  18000, 18500, 19000, 19500, 20000, 21000, 22000, 23000, 24000, 25000, 26000,
  27000, 28000, 29000, 30000, 32000, 35000, 40000, 45000, 50000,
];

export function getProfissaoBySlug(slug: string): ProfissaoSEO | undefined {
  return PROFISSOES_SEO.find((p) => p.slug === slug);
}
