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

  // Estado Rescisão
  const [salarioBruto, setSalarioBruto] = useState<number>(4500);
  const [mesesTrabalhados, setMesesTrabalhados] = useState<number>(24);
  const [diasNoMes, setDiasNoMes] = useState<number>(15);
  const [motivo, setMotivo] = useState<MotivoRescisao>("sem_justa_causa");
  const [feriasVencidas, setFeriasVencidas] = useState<boolean>(false);
  const [avisoIndenizado, setAvisoIndenizado] = useState<boolean>(true);

  // Estado Férias
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
      {/* Seletor de Abas (Retém o usuário na página para 2 cálculos seguidos) */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 max-w-md">
        <button
          type="button"
          onClick={() => setAbaAtiva("rescisao")}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            abaAtiva === "rescisao"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📋 Simulador de Rescisão CLT
        </button>
        <button
          type="button"
          onClick={() => setAbaAtiva("ferias")}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
            abaAtiva === "ferias"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🏖️ Calculadora de Férias 2026
        </button>
      </div>

      {abaAtiva === "rescisao" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Último Salário Bruto (R$)
              </label>
              <input
                type="number"
                step={200}
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motivo do Desligamento
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value as MotivoRescisao)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="sem_justa_causa">Demissão sem Justa Causa</option>
                <option value="acordo_comum">Acordo Comum (Reforma Trabalhista)</option>
                <option value="pedido_demissao">Pedido de Demissão pelo Funcionário</option>
                <option value="justa_causa">Demissão por Justa Causa</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meses na Empresa
                </label>
                <input
                  type="number"
                  min={1}
                  max={360}
                  value={mesesTrabalhados}
                  onChange={(e) =>
                    setMesesTrabalhados(Number(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dias trab. no mês
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={diasNoMes}
                  onChange={(e) => setDiasNoMes(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="md:col-span-3 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avisoIndenizado}
                  onChange={(e) => setAvisoIndenizado(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                Aviso Prévio Indenizado (pago na rescisão)
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feriasVencidas}
                  onChange={(e) => setFeriasVencidas(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                Possui 1 período de Férias Vencidas
              </label>
            </div>
          </div>

          <AdSlot
            slotId="rescisao-mid-slot"
            format="in-result"
            label="Antecipação do Saque-Aniversário FGTS ou Consultoria Trabalhista Online"
            estimatedCpc="CPC Médio: R$ 3,20 (Antecipação FGTS / Advocacia Trabalhista)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
              <span className="text-xs font-bold uppercase text-emerald-400">
                Total Geral (Rescisão + FGTS Liberado)
              </span>
              <p className="text-3xl font-black mt-1">
                {formatBRL(rescisao.totalGeralComFGTS)}
              </p>
              <div className="mt-4 pt-4 border-t border-white/15 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Verbas Rescisórias Líquidas na Conta:</span>
                  <strong className="text-white">
                    {formatBRL(rescisao.totalRescisaoEmConta)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Saque FGTS Acumulado + Multa ({motivo === "sem_justa_causa" ? "40%" : motivo === "acordo_comum" ? "20%" : "0%"}):</span>
                  <strong className="text-emerald-400">
                    {formatBRL(rescisao.saqueFGTSLiberado)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-xs sm:text-sm space-y-2">
              <h4 className="font-bold text-slate-900 mb-3">
                Discriminação das Verbas Rescisórias
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-600">Saldo de Salário ({diasNoMes} dias)</span>
                <span className="font-semibold">{formatBRL(rescisao.saldoSalario)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">13º Salário Proporcional</span>
                <span className="font-semibold">{formatBRL(rescisao.decimoTerceiroProporcional)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Férias Proporcionais + 1/3</span>
                <span className="font-semibold">{formatBRL(rescisao.feriasProporcionaisComTerco)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Aviso Prévio Indenizado</span>
                <span className="font-semibold">{formatBRL(rescisao.valorAvisoPrevio)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>(-) Descontos INSS sobre Saldo/13º</span>
                <span className="font-semibold">- {formatBRL(rescisao.totalDescontos)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Salário Bruto Mensal (R$)
              </label>
              <input
                type="number"
                step={200}
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dias de Descanso de Férias
              </label>
              <select
                value={diasFerias}
                onChange={(e) => setDiasFerias(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value={30}>30 dias corridos</option>
                <option value={20}>20 dias (vendendo 10 dias)</option>
                <option value={15}>15 dias</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={venderDezDias}
                  onChange={(e) => setVenderDezDias(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                Vender 10 dias (Abono Pecuniário Isento de Imposto de Renda!)
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adiantar13}
                  onChange={(e) => setAdiantar13(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                Adiantar 1ª Parcela do 13º Salário (50%)
              </label>
            </div>
          </div>

          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-400">
                Valor Líquido das Férias (Depositado até 2 dias antes)
              </span>
              <p className="text-3xl font-black mt-1">
                {formatBRL(ferias.liquidoReceber)}
              </p>
            </div>
            <div className="text-xs space-y-1 text-emerald-200">
              <div>Férias + 1/3 Constitucional: {formatBRL(ferias.valorFeriasBruto + ferias.tercoConstitucional)}</div>
              {ferias.abonoPecuniario > 0 && (
                <div>(+) Abono Pecuniário (10 dias): {formatBRL(ferias.abonoPecuniario)}</div>
              )}
              {ferias.adiantamento13 > 0 && (
                <div>(+) Adiantamento 13º: {formatBRL(ferias.adiantamento13)}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <LegalDisclaimerBox />
    </div>
  );
}
