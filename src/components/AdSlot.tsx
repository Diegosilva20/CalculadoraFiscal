"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slotId: string;
  format?: "leaderboard" | "rectangle" | "in-result" | "sidebar";
  label?: string;
  estimatedCpc?: string;
}

/**
 * Componente de Anúncio Otimizado para Google AdSense (Zero CLS / Core Web Vitals 100)
 * - Com NEXT_PUBLIC_ADSENSE_CLIENT_ID configurado: renderiza o bloco oficial <ins class="adsbygoogle">
 *   com altura mínima reservada (evitando Cumulative Layout Shift) e dispara o push seguro.
 * - Sem NEXT_PUBLIC_ADSENSE_CLIENT_ID em PRODUÇÃO (fase de aprovação do site no AdSense):
 *   retorna null para manter o layout 100% limpo e editorial, evitando reprovação por "placeholder vazio".
 * - Sem NEXT_PUBLIC_ADSENSE_CLIENT_ID em DESENVOLVIMENTO (localhost):
 *   exibe o marcador visual para inspeção de posicionamento e contexto de CPC.
 */
export default function AdSlot({
  slotId,
  format = "leaderboard",
  label = "Espaço Publicitário Google AdSense",
  estimatedCpc = "CPC Médio: R$ 2,40 – R$ 5,80 (Finanças / Contabilidade B2B)",
}: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isDev = process.env.NODE_ENV !== "production";
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!clientId || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Silencia bloqueadores de anúncio (AdBlock) no navegador do visitante
    }
  }, [clientId]);

  // Em produção, enquanto o ID do AdSense ainda não foi configurado, oculta o placeholder
  // para que o revisor humano do Google AdSense veja apenas conteúdo editorial puro.
  if (!clientId && !isDev) {
    return null;
  }

  const heightClasses = {
    leaderboard: "min-h-[96px] md:min-h-[100px]",
    rectangle: "min-h-[250px]",
    "in-result": "min-h-[120px]",
    sidebar: "min-h-[280px]",
  }[format];

  return (
    <div
      className={`w-full my-5 rounded-xl ${
        clientId
          ? "bg-transparent"
          : "border border-dashed border-slate-300 bg-slate-50/90 p-3"
      } flex flex-col items-center justify-center text-center transition-all ${heightClasses}`}
      aria-label="Publicidade"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        Publicidade{!clientId ? ` • Modo Dev (${slotId})` : ""}
      </span>

      {clientId ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="max-w-lg">
          <p className="text-xs font-medium text-slate-600">{label}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {estimatedCpc}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Anunciantes típicos: Contabilizei, Agilize, BTG Empresas, Cora, Omie, Bling
          </p>
        </div>
      )}
    </div>
  );
}
