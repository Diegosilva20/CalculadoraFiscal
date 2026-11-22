"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton({
  label = "Imprimir / Salvar PDF",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
    >
      <Printer className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
