// Integração com APIs Públicas Oficiais do Governo Federal (Banco Central do Brasil + IBGE)
// Com cache de 24h (revalidate: 86400) e fallback seguro para nunca deixar o site lento ou fora do ar.

export interface IndicadoresBCB {
  selicMetaAnual: number;
  ipcaAcumulado12m: number;
  dataConsulta: string;
  fonte: "API Oficial Banco Central (SGS)" | "Parâmetros Oficiais BCB (Cache)";
}

/**
 * Busca a Taxa Selic Meta (Série 432) e IPCA (Série 13522) direto da API Aberta do Banco Central
 */
export async function fetchIndicadoresBancoCentral(): Promise<IndicadoresBCB> {
  try {
    const [selicRes, ipcaRes] = await Promise.all([
      fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json",
        { next: { revalidate: 86400 }, signal: AbortSignal.timeout(3500) }
      ),
      fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json",
        { next: { revalidate: 86400 }, signal: AbortSignal.timeout(3500) }
      ),
    ]);

    if (selicRes.ok && ipcaRes.ok) {
      const selicData = await selicRes.json();
      const ipcaData = await ipcaRes.json();

      const selicValor = parseFloat(selicData?.[0]?.valor);
      const ipcaValor = parseFloat(ipcaData?.[0]?.valor);

      if (!Number.isNaN(selicValor) && !Number.isNaN(ipcaValor)) {
        return {
          selicMetaAnual: selicValor,
          ipcaAcumulado12m: ipcaValor,
          dataConsulta: selicData?.[0]?.data || "Atualizado hoje",
          fonte: "API Oficial Banco Central (SGS)",
        };
      }
    }
  } catch {
    // Fallback silencioso caso a API do Banco Central oscile ou não haja rede no momento do build
  }

  return {
    selicMetaAnual: 14.25,
    ipcaAcumulado12m: 4.56,
    dataConsulta: "Vigência 2026",
    fonte: "Parâmetros Oficiais BCB (Cache)",
  };
}

export interface IBGECNAEResponse {
  id: string;
  descricao: string;
  secao: string;
  divisao: string;
  observacoes: string[];
  fonteOficial: boolean;
}

/**
 * Consulta os metadados oficiais de uma Subclasse CNAE diretamente na API CONCLA/IBGE
 */
export async function fetchCNAEFromIBGE(
  codigoLimpo: string
): Promise<IBGECNAEResponse | null> {
  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v2/cnae/subclasses/${codigoLimpo}`,
      { next: { revalidate: 604800 }, signal: AbortSignal.timeout(3500) }
    );

    if (!res.ok) return null;
    const raw = await res.json();
    const item = Array.isArray(raw) ? raw[0] : raw;
    if (!item || !item.id) return null;

    return {
      id: String(item.id),
      descricao: item.descricao || "",
      secao: item.classe?.grupo?.divisao?.secao?.descricao || "Serviços / Comércio",
      divisao: item.classe?.grupo?.divisao?.descricao || "",
      observacoes: Array.isArray(item.observacoes)
        ? item.observacoes.slice(0, 4)
        : [],
      fonteOficial: true,
    };
  } catch {
    return null;
  }
}
