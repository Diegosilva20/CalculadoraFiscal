"use client";

import React, { useState } from "react";
import {
  MotivoRescisao,
  calculateFeriasCLT,
  calculateRescisaoCLT,
  formatBRL,
} from "@/lib/calculators";
import AdSlot from "./AdSlot";
import LegalDisclaimerBox from "./LegalDisclaimerBox";
import PrintButton from "./PrintButton";
import { Copy, Check } from "lucide-react";

const PRESETS_RESCISAO = [2500, 4500, 7500, 12000];

export default function RescisaoFeriasCalculator() {
  const [abaAtiva, setAbaAtiva] = useState<"rescisao" | "ferias">("rescisao");

  const [salarioBruto, setSalarioBruto] = useState<number>(4500);
  const [mesesTrabalhados, setMesesTrabalhados] = useState<number>(24);
  const [diasNoMes, setDiasNoMes] = useState<number>(15);
  const [motivo, setMotivo] = useState<MotivoRescisao>("sem_justa_causa");
  const [feriasVencidas, setFeriasVencidas] = useState<boolean>(false);
  const [avisoIndenizado, setAvisoIndenizado] = useState<boolean>(true);
  const [dependentes, setDependentes] = useState<number>(0);

  const [diasFerias, setDiasFerias] = useState<number>(30);
  const [venderDezDias, setVenderDezDias] = useState<boolean>(false);
  const [adiantar13, setAdiantar13] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  const rescisao = calculateRescisaoCLT({
    salarioBruto,
    mesesTrabalhados,
    diasTrabalhadosNoMes: diasNoMes,
    motivo,
    feriasVencidas,
    avisoPrevioIndenizado: avisoIndenizado,
    dependentes,
  });

  const ferias = calculateFeriasCLT({
    salarioBruto,
    diasFerias,
    venderDezDias,
    adiantarPrimeiraParcela13: adiantar13,
    dependentes,
  });

  const copiarResumo = () => {
    const texto =
      abaAtiva === "rescisao"
        ? `Simulação de Rescisão CLT 2026 (CalculaFiscal)\n- Salário bruto: ${formatBRL(
            salarioBruto
          )} (${mesesTrabalhados} meses)\n- Saldo de salário (${diasNoMes}d): ${formatBRL(
            rescisao.saldoSalario
          )}\n- 13º proporcional (${rescisao.mesesProporcionais}/12): ${formatBRL(
            rescisao.decimoTerceiroProporcional
          )}\n- Férias proporcionais + 1/3: ${formatBRL(
            rescisao.feriasProporcionaisComTerco
          )}${
            rescisao.valorFeriasVencidas > 0
              ? `\n- Férias vencidas + 1/3: ${formatBRL(rescisao.valorFeriasVencidas)}`
              : ""
          }${
            rescisao.valorAvisoPrevio > 0
              ? `\n- Aviso prévio (${rescisao.diasAviso}d): ${formatBRL(rescisao.valorAvisoPrevio)}`
              : ""
          }${
            rescisao.reflexo13Aviso > 0
              ? `\n- 13º indenizado s/ aviso (${rescisao.avosProjetadosAviso}/12): ${formatBRL(rescisao.reflexo13Aviso)}`
              : ""
          }${
            rescisao.reflexoFeriasAviso > 0
              ? `\n- Férias indenizadas + 1/3 s/ aviso (${rescisao.avosProjetadosAviso}/12): ${formatBRL(rescisao.reflexoFeriasAviso)}`
              : ""
          }\n- Descontos (INSS + IRRF): -${formatBRL(
            rescisao.totalDescontos
          )}\n- Total líquido em conta: ${formatBRL(
            rescisao.totalRescisaoEmConta
          )}\n- FGTS + Multa liberados: ${formatBRL(
            rescisao.saqueFGTSLiberado
          )}\n- Total geral estimado: ${formatBRL(rescisao.totalGeralComFGTS)}`
        : `Simulação de Férias CLT 2026 (CalculaFiscal)\n- Salário bruto: ${formatBRL(
            salarioBruto
          )} (${diasFerias} dias)\n- Férias + 1/3: ${formatBRL(
            ferias.valorFeriasBruto + ferias.tercoConstitucional
          )}\n- Descontos (INSS + IRRF): -${formatBRL(
            ferias.inss + ferias.irpf
          )}\n- Valor líquido a receber: ${formatBRL(ferias.liquidoReceber)}`;

    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Selecionar tipo de simulação trabalhista"
          className="flex rounded-lg bg-slate-200/80 p-1 max-w-md w-full"
        >
          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === "rescisao"}
            onClick={() => setAbaAtiva("rescisao")}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              abaAtiva === "rescisao"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rescisão contratual CLT
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === "ferias"}
            onClick={() => setAbaAtiva("ferias")}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
              abaAtiva === "ferias"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Cálculo de férias
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS_RESCISAO.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setSalarioBruto(v)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                salarioBruto === v
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              R$ {v.toLocaleString("pt-BR")}
            </button>
          ))}
        </div>
      </div>

      {abaAtiva === "rescisao" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="resc-salario"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Último salário bruto (R$)
              </label>
              <input
                id="resc-salario"
                type="number"
                step={200}
                min={0}
                value={salarioBruto}
                onChange={(e) =>
                  setSalarioBruto(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full px-3.5 py-2.5 text-base font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="resc-motivo"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Tipo de desligamento
              </label>
              <select
                id="resc-motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value as MotivoRescisao)}
                className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="sem_justa_causa">Demissão sem justa causa</option>
                <option value="acordo_comum">Acordo trabalhista (Art. 484-A)</option>
                <option value="pedido_demissao">Pedido de demissão</option>
                <option value="justa_causa">Demissão por justa causa</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="resc-meses"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Meses na empresa
                </label>
                <input
                  id="resc-meses"
                  type="number"
                  min={1}
                  max={480}
                  value={mesesTrabalhados}
                  onChange={(e) =>
                    setMesesTrabalhados(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full px-3 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="resc-dias"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Dias no mês
                </label>
                <input
                  id="resc-dias"
                  type="number"
                  min={0}
                  max={30}
                  value={diasNoMes}
                  onChange={(e) =>
                    setDiasNoMes(Math.max(0, Math.min(30, Number(e.target.value) || 0)))
                  }
                  className="w-full px-3 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={avisoIndenizado}
                    onChange={(e) => setAvisoIndenizado(e.target.checked)}
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                  Aviso prévio indenizado
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feriasVencidas}
                    onChange={(e) => setFeriasVencidas(e.target.checked)}
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                  Inclui 1 período de férias vencidas
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="resc-dependentes"
                  className="text-xs font-medium text-slate-700"
                >
                  Dependentes IRPF:
                </label>
                <input
                  id="resc-dependentes"
                  type="number"
                  min={0}
                  max={20}
                  value={dependentes}
                  onChange={(e) =>
                    setDependentes(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-16 px-2.5 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <AdSlot
            slotId="rescisao-mid-slot"
            format="in-result"
            label="Aplicações de liquidez diária para acerto rescisório e consulta FGTS"
            estimatedCpc="CPC Médio: R$ 3,20 (CDB Liquidez / Crédito FGTS)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 border-t-4 border-t-blue-700 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Total estimado (rescisão + FGTS)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={copiarResumo}
                    aria-live="polite"
                    className="no-print inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    {copiado ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar
                      </>
                    )}
                  </button>
                  <PrintButton label="PDF" />
                </div>
              </div>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {formatBRL(rescisao.totalGeralComFGTS)}
              </p>
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Verbas rescisórias líquidas em conta:</span>
                  <strong className="font-mono text-slate-900">
                    {formatBRL(rescisao.totalRescisaoEmConta)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>
                    Saldo FGTS e multa ({motivo === "sem_justa_causa" ? "40%" : motivo === "acordo_comum" ? "20%" : "0%"}):
                  </span>
                  <strong className="font-mono text-emerald-700">
                    {formatBRL(rescisao.saqueFGTSLiberado)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 text-xs sm:text-sm space-y-2.5">
              <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
                Discriminação das verbas
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-600">Saldo de salário ({diasNoMes} dias)</span>
                <span className="font-mono font-semibold">{formatBRL(rescisao.saldoSalario)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  13º proporcional ({rescisao.mesesProporcionais}/12)
                </span>
                <span className="font-mono font-semibold">{formatBRL(rescisao.decimoTerceiroProporcional)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Férias proporcionais ({rescisao.mesesProporcionais}/12) + 1/3
                </span>
                <span className="font-mono font-semibold">{formatBRL(rescisao.feriasProporcionaisComTerco)}</span>
              </div>
              {rescisao.valorFeriasVencidas > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Férias vencidas + 1/3</span>
                  <span className="font-mono font-semibold">{formatBRL(rescisao.valorFeriasVencidas)}</span>
                </div>
              )}
              {rescisao.valorAvisoPrevio > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Aviso prévio indenizado ({rescisao.diasAviso} dias)
                  </span>
                  <span className="font-mono font-semibold">{formatBRL(rescisao.valorAvisoPrevio)}</span>
                </div>
              )}
              {rescisao.reflexo13Aviso > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    13º indenizado s/ aviso prévio ({rescisao.avosProjetadosAviso}/12)
                  </span>
                  <span className="font-mono font-semibold">{formatBRL(rescisao.reflexo13Aviso)}</span>
                </div>
              )}
              {rescisao.reflexoFeriasAviso > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Férias indenizadas + 1/3 s/ aviso ({rescisao.avosProjetadosAviso}/12)
                  </span>
                  <span className="font-mono font-semibold">{formatBRL(rescisao.reflexoFeriasAviso)}</span>
                </div>
              )}
              <div className="flex justify-between text-rose-700 pt-1 border-t border-slate-100">
                <span>Descontos INSS ({formatBRL(rescisao.inssDescontado)}) + IRRF ({formatBRL(rescisao.irpfDescontado)})</span>
                <span className="font-mono font-semibold">- {formatBRL(rescisao.totalDescontos)}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                Nota fiscal: aviso prévio indenizado e férias indenizadas (com 1/3) são isentos de INSS e IRRF; o 13º proporcional e seu reflexo sobre o aviso sofrem tributação exclusiva na fonte.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="ferias-salario"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Salário bruto mensal (R$)
              </label>
              <input
                id="ferias-salario"
                type="number"
                step={200}
                min={0}
                value={salarioBruto}
                onChange={(e) =>
                  setSalarioBruto(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full px-3.5 py-2.5 text-base font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="ferias-dias"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Dias de descanso
              </label>
              <select
                id="ferias-dias"
                value={diasFerias}
                onChange={(e) => setDiasFerias(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value={30}>30 dias corridos</option>
                <option value={20}>20 dias (abono de 10 dias)</option>
                <option value={15}>15 dias</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={venderDezDias}
                    onChange={(e) => setVenderDezDias(e.target.checked)}
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                  Vender 10 dias (abono pecuniário isento de IRRF)
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adiantar13}
                    onChange={(e) => setAdiantar13(e.target.checked)}
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                  Adiantar 1ª parcela do 13º salário (50%)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="ferias-dependentes"
                  className="text-xs font-medium text-slate-700"
                >
                  Dependentes IRPF:
                </label>
                <input
                  id="ferias-dependentes"
                  type="number"
                  min={0}
                  max={20}
                  value={dependentes}
                  onChange={(e) =>
                    setDependentes(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-16 px-2.5 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-700 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-semibold text-slate-500">
                  Valor líquido estimado das férias (depósito até 2 dias antes)
                </span>
                <button
                  type="button"
                  onClick={copiarResumo}
                  className="no-print inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  {copiado ? "Copiado" : "Copiar"}
                </button>
                <PrintButton label="PDF" />
              </div>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
                {formatBRL(ferias.liquidoReceber)}
              </p>
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-mono">
              <div>
                Férias + 1/3: {formatBRL(ferias.valorFeriasBruto + ferias.tercoConstitucional)}
              </div>
              <div className="text-rose-700">
                INSS + IRRF: - {formatBRL(ferias.inss + ferias.irpf)}
              </div>
              {ferias.abonoPecuniario > 0 && (
                <div>Abono pecuniário (10 dias): {formatBRL(ferias.abonoPecuniario)}</div>
              )}
              {ferias.adiantamento13 > 0 && (
                <div>Adiantamento 13º: {formatBRL(ferias.adiantamento13)}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <LegalDisclaimerBox />
    </div>
  );
}
