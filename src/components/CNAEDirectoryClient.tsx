"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CNAEItem } from "@/data/cnaes";
import { ArrowRight, CheckCircle2, XCircle, Sparkles, Search, Filter } from "lucide-react";

const CATEGORIAS = [
  "Todas",
  "Tecnologia e TI",
  "Saúde e Medicina",
  "Engenharia e Arquitetura",
  "Marketing, Design e Digital",
  "Consultoria e Gestão",
  "Comércio e E-commerce",
  "Educação e Treinamentos",
  "Serviços Administrativos",
] as const;

export default function CNAEDirectoryClient({ cnaes }: { cnaes: CNAEItem[] }) {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todas");
  const [apenasMEI, setApenasMEI] = useState(false);
  const [apenas6Porcento, setApenas6Porcento] = useState(false);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return cnaes.filter((c) => {
      if (categoriaAtiva !== "Todas" && c.categoria !== categoriaAtiva) {
        return false;
      }
      if (apenasMEI && !c.permiteMEI) {
        return false;
      }
      if (apenas6Porcento && !(c.anexo === "III" || c.anexo === "I" || c.anexo === "IV" || c.fatorR)) {
        return false;
      }
      if (!termo) return true;
      return (
        c.codigo.toLowerCase().includes(termo) ||
        c.codigoLimpo.includes(termo) ||
        c.nomePopular.toLowerCase().includes(termo) ||
        c.titulo.toLowerCase().includes(termo) ||
        c.atividadesCompreendidas.some((a) => a.toLowerCase().includes(termo))
      );
    });
  }, [cnaes, busca, categoriaAtiva, apenasMEI, apenas6Porcento]);

  return (
    <div className="space-y-6">
      {/* Barra de Busca e Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque por código CNAE (ex: 6201, 8630, 7319) ou profissão (ex: programador, médico, tráfego, shopee)..."
            className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                categoriaAtiva === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={apenasMEI}
                onChange={(e) => setApenasMEI(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              Mostrar apenas CNAEs que permitem MEI
            </label>
            <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={apenas6Porcento}
                onChange={(e) => setApenas6Porcento(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Elegíveis a 4%–6% (Anexo I/III/IV ou Fator R)
            </label>
          </div>

          <span className="text-slate-500 font-semibold">
            Exibindo <strong>{filtrados.length}</strong> de {cnaes.length} CNAEs mapeados
          </span>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Código CNAE</th>
                <th className="py-3.5 px-4">Atividade / Profissão</th>
                <th className="py-3.5 px-4">Anexo Simples</th>
                <th className="py-3.5 px-4">Fator R (6%)</th>
                <th className="py-3.5 px-4">Pode MEI?</th>
                <th className="py-3.5 px-4">Desconto IVA 2026</th>
                <th className="py-3.5 px-4">Calculadora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((cnae) => (
                <tr key={cnae.codigoLimpo} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-blue-700 whitespace-nowrap">
                    <Link href={`/cnae/${cnae.slug}`} className="hover:underline">
                      {cnae.codigo}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/cnae/${cnae.slug}`}
                      className="font-bold text-slate-900 hover:text-blue-600 block"
                    >
                      {cnae.nomePopular}
                    </Link>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {cnae.titulo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded font-bold bg-slate-100 text-slate-800 text-xs">
                      Anexo {cnae.anexo} ({(cnae.aliquotaInicialNominal * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {cnae.fatorR ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" /> Cai p/ 6% (Anexo III)
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Direto Anexo {cnae.anexo}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {cnae.permiteMEI ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Sim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-xs">
                        <XCircle className="w-4 h-4" /> Não
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {cnae.reducaoIVA2026 > 0 ? (
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        -{(cnae.reducaoIVA2026 * 100).toFixed(0)}% no IVA
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Alíquota Padrão</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      href={`/cnae/${cnae.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      Calcular DAS <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    Nenhum CNAE encontrado para &ldquo;{busca}&rdquo;. Tente buscar por outro termo ou limpar os filtros acima.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
