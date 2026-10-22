"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "calculafiscal_lgpd_consent_v1";

export default function CookieConsentBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (!salvo) {
        setVisivel(true);
      }
    } catch {
      // Ignora em caso de bloqueio de localStorage
    }
  }, []);

  const salvarConsentimento = (tipo: "all" | "essential") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tipo, data: new Date().toISOString() })
      );
    } catch {
      // Ignora
    }
    setVisivel(false);
  };

  if (!visivel) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de Cookies e Privacidade LGPD"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700 text-slate-200 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-xs leading-relaxed">
          <Cookie className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Privacidade & LGPD:</strong> Nossas calculadoras processam todos os valores{" "}
            <strong className="text-emerald-400">100% no seu navegador</strong> sem salvar seus dados salariais. Utilizamos cookies apenas para estatísticas anônimas e exibição de anúncios relevantes via Google AdSense, conforme nossa{" "}
            <Link
              href="/politica-de-privacidade"
              className="text-blue-400 font-semibold underline hover:text-blue-300"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => salvarConsentimento("essential")}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Apenas Essenciais
          </button>
          <button
            type="button"
            onClick={() => salvarConsentimento("all")}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
          >
            Aceitar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
