import React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

/**
 * Nota legal exibida junto aos resultados das simulações para transparência metodológica.
 */
export default function LegalDisclaimerBox() {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-[11px] sm:text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
      <Scale className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
      <div>
        <strong className="text-slate-800">Nota sobre a estimativa:</strong> os valores exibidos acima têm caráter informativo e se baseiam nas tabelas federais padrão vigentes em 2026. Alíquotas municipais de ISS (2% a 5%), regras estaduais, convenções coletivas (CCT) e particularidades societárias podem alterar o cálculo final. Antes de firmar contratos, pedir desligamento ou recolher guias, valide os números com um contador habilitado no CRC ou advogado. Ao utilizar o simulador, você concorda com os{" "}
        <Link
          href="/termos-de-uso"
          className="font-semibold text-slate-800 underline hover:text-blue-700"
        >
          Termos de Uso
        </Link>
        .
      </div>
    </div>
  );
}
