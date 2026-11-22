// Faixas salariais programáticas (de R$ 1.750 até R$ 50.000) em módulo leve separado
// para evitar incluir o catálogo completo de profissões no bundle client-side.
export const FAIXAS_SALARIAIS_SEO: number[] = [
  1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750,
  5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000,
  8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10500, 11000, 11500, 12000,
  12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500,
  18000, 18500, 19000, 19500, 20000, 21000, 22000, 23000, 24000, 25000, 26000,
  27000, 28000, 29000, 30000, 32000, 35000, 40000, 45000, 50000,
];

/**
 * Retorna a faixa salarial oficial do sitemap mais próxima de um valor informado,
 * evitando que links internos apontem para URLs fora da malha canônica do Google.
 */
export function getNearestSalarioSEO(valor: number): number {
  const safeVal = Number.isFinite(valor) ? valor : 5000;
  return FAIXAS_SALARIAIS_SEO.reduce((prev, curr) =>
    Math.abs(curr - safeVal) < Math.abs(prev - safeVal) ? curr : prev
  );
}
