import React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

/**
 * Aviso Legal Visível Junto ao Resultado (Blindagem Jurídica contra Responsabilidade Civil)
 * Garante que o usuário seja informado no exato momento da visualização do cálculo
 * de que os valores são estimativas educativas sujeitas a variações municipais/sindicais.
 */
export default function LegalDisclaimerBox() {
  return (
    <div className="rounded-xl bg-amber-50/80 border border-amber-200/90 p-3.5 text-[11px] sm:text-xs text-amber-950 leading-relaxed flex items-start gap-2.5">
      <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div>
        <strong>Aviso Legal Importante (Simulação Estimativa):</strong> Os valores calculados acima são <strong>estimativas matemáticas de caráter exclusivamente educativo e informativo</strong> baseadas nas tabelas federais padrão. Alíquotas municipais de ISS (2% a 5%), legislações estaduais, convenções coletivas sindicais (CCT) e regimes fiscais específicos podem alterar os valores reais. Este simulador <strong>não emite guias oficiais e não substitui a conferência por um Contador habilitado (CRC)</strong> ou advogado antes de assinar contratos, pedir demissão ou recolher tributos. Ao utilizar esta ferramenta, você concorda integralmente com os nossos{" "}
        <Link
          href="/termos-de-uso"
          className="font-bold underline hover:text-amber-800"
        >
          Termos de Uso e Isenção de Responsabilidade
        </Link>
        .
      </div>
    </div>
  );
}
