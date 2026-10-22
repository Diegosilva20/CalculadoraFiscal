"use client";

import React from "react";

interface AdSlotProps {
  slotId: string;
  format?: "leaderboard" | "rectangle" | "in-result" | "sidebar";
  label?: string;
  estimatedCpc?: string;
}

/**
 * Componente de Anúncio Otimizado para Google AdSense (Zero CLS / Core Web Vitals 100)
 * Quando NEXT_PUBLIC_ADSENSE_CLIENT_ID estiver configurado no .env.local, renderiza o bloco oficial do AdSense.
 * Enquanto estiver em modo de desenvolvimento/aprovação, mostra o marcador visual estratégico de alta conversão.
 */
export default function AdSlot({
  slotId,
  format = "leaderboard",
  label = "Espaço Publicitário Google AdSense",
  estimatedCpc = "CPC Médio: R$ 2,40 – R$ 5,80 (Finanças / Contabilidade B2B)",
}: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  const heightClasses = {
    leaderboard: "min-h-[96px] md:min-h-[100px]",
    rectangle: "min-h-[250px]",
    "in-result": "min-h-[120px]",
    sidebar: "min-h-[280px]",
  }[format];

  return (
    <div
      className={`w-full my-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/90 flex flex-col items-center justify-center p-3 text-center transition-all ${heightClasses}`}
      aria-label="Publicidade"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        Publicidade • AdSense ({slotId})
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
