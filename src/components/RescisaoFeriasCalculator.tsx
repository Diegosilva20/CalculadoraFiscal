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

export default function RescisaoFeriasCalculator() {
  const [abaAtiva, setAbaAtiva] = useState<"rescisao" | "ferias">("rescisao");

  const [salarioBruto, setSalarioBruto] = useState<number>(4500);
  const [mesesTrabalhados, setMesesTrabalhados] = useState<number>(24);
  const [diasNoMes, setDiasNoMes] = useState<number>(15);
  const [motivo, setMotivo] = useState<MotivoRescisao>("sem_justa_causa");
  const [feriasVencidas, setFeriasVencidas] = useState<boolean>(false);
  const [avisoIndenizado, setAvisoIndenizado] = useState<boolean>(true);

  const [diasFerias, setDiasFerias] = useState<number>(30);
  const [venderDezDias, setVenderDezDias] = useState<boolean>(false);
  const [adiantar13, setAdiantar13] = useState<boolean>(false);

  const rescisao = calculateRescisaoCLT({
    salarioBruto,
    mesesTrabalhados,
    diasTrabalhadosNoMes: diasNoMes,
    motivo,
    feriasVencidas,
    avisoPrevioIndenizado: avisoIndenizado,
  });

  const ferias = calculateFeriasCLT({
    salarioBruto,
    diasFerias,
    venderDezDias,
    adiantarPrimeiraParcela13: adiantar13,
  });

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg bg-slate-200/80 p-1 max-w-md">
        <button
          type="button"
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

      {abaAtiva === "rescisao" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Último salário bruto (R$)
              </label>
              <input
                type="number"
                step={200}
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo de desligamento
              </label>
              <select
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meses trabalhados
                </label>
                <input
                  type="number"
                  min={1}
                  max={360}
                  value={mesesTrabalhados}
                  onChange={(e) =>
                    setMesesTrabalhados(Number(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dias no mês
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={diasNoMes}
                  onChange={(e) => setDiasNoMes(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="md:col-span-3 flex flex-wrap gap-6 pt-1">
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
          </div>

          <AdSlot
            slotId="rescisao-mid-slot"
            format="in-result"
            label="Aplicações de liquidez diária para acerto rescisório e consulta FGTS"
            estimatedCpc="CPC Médio: R$ 3,20 (CDB Liquidez / Crédito FGTS)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 border-t-4 border-t-blue-700 rounded-xl p-6">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Total estimado (rescisão + FGTS)
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 mt-1">
                {formatBRL(rescisao.totalGeralComFGTS)}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
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
                <span className="text-slate-600">13º salário proporcional</span>
                <span className="font-mono font-semibold">{formatBRL(rescisao.decimoTerceiroProporcional)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Férias proporcionais + 1/3</span>
                <span className="font-mono font-semibold">{formatBRL(rescisao.feriasProporcionaisComTerco)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Aviso prévio indenizado</span>
                <span className="font-mono font-semibold">{formatBRL(rescisao.valorAvisoPrevio)}</span>
              </div>
              <div className="flex justify-between text-rose-700 pt-1 border-t border-slate-100">
                <span>Descontos INSS sobre saldo e 13º</span>
                <span className="font-mono font-semibold">- {formatBRL(rescisao.totalDescontos)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salário bruto mensal (R$)
              </label>
              <input
                type="number"
                step={200}
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-base font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dias de descanso
              </label>
              <select
                value={diasFerias}
                onChange={(e) => setDiasFerias(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value={30}>30 dias corridos</option>
                <option value={20}>20 dias (abono de 10 dias)</option>
                <option value={15}>15 dias</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-6">
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
          </div>

          <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-700 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-500">
                Valor líquido estimado das férias (depósito até 2 dias antes)
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700 mt-1">
                {formatBRL(ferias.liquidoReceber)}
              </p>
            </div>
            <div className="text-xs space-y-1 text-slate-600 font-mono">
              <div>
                Férias + 1/3 constitucional: {formatBRL(ferias.valorFeriasBruto + ferias.tercoConstitucional)}
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
