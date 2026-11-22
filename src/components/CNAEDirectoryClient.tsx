"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { CNAEItem } from "@/data/cnaes";
import { ArrowRight, Check, Minus, Search, Filter } from "lucide-react";

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

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) setBusca(q);
    } catch {
      // Ignora se location não estiver disponível
    }
  }, []);

  const limparFiltros = () => {
    setBusca("");
    setCategoriaAtiva("Todas");
    setApenasMEI(false);
    setApenas6Porcento(false);
  };

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const termoDigitos = termo.replace(/\D/g, "");
    return cnaes.filter((c) => {
      if (categoriaAtiva !== "Todas" && c.categoria !== categoriaAtiva) {
        return false;
      }
      if (apenasMEI && !c.permiteMEI) {
        return false;
      }
      if (
        apenas6Porcento &&
        !(c.anexo === "III" || c.anexo === "I" || c.anexo === "IV" || c.fatorR)
      ) {
        return false;
      }
      if (!termo) return true;
      return (
        c.codigo.toLowerCase().includes(termo) ||
        c.codigoLimpo.includes(termo) ||
        (termoDigitos.length >= 2 && c.codigoLimpo.includes(termoDigitos)) ||
        c.nomePopular.toLowerCase().includes(termo) ||
        c.titulo.toLowerCase().includes(termo) ||
        c.atividadesCompreendidas.some((a) => a.toLowerCase().includes(termo))
      );
    });
  }, [cnaes, busca, categoriaAtiva, apenasMEI, apenas6Porcento]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="relative">
          <label htmlFor="cnae-busca" className="sr-only">
            Filtrar por código CNAE ou descrição da atividade
          </label>
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id="cnae-busca"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar por código CNAE (ex: 6201, 8630, 7319) ou atividade (ex: programador, médico, comércio)..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
          />
        </div>

        <div
          role="group"
          aria-label="Filtrar CNAEs por categoria"
          className="flex items-center gap-1.5 overflow-x-auto pb-1"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" aria-hidden="true" />
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={categoriaAtiva === cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                categoriaAtiva === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={apenasMEI}
                onChange={(e) => setApenasMEI(e.target.checked)}
                className="w-4 h-4 accent-blue-700 rounded"
              />
              Somente atividades permitidas no MEI
            </label>
            <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={apenas6Porcento}
                onChange={(e) => setApenas6Porcento(e.target.checked)}
                className="w-4 h-4 accent-blue-700 rounded"
              />
              Elegíveis a 4%–6% (Anexo I/III/IV ou Fator R)
            </label>
          </div>

          <span className="text-slate-500 font-medium">
            <strong className="text-slate-900">{filtrados.length}</strong> de{" "}
            {cnaes.length} códigos exibidos
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-4">Código CNAE</th>
                <th scope="col" className="py-3.5 px-4">Atividade</th>
                <th scope="col" className="py-3.5 px-4">Anexo</th>
                <th scope="col" className="py-3.5 px-4">Fator R</th>
                <th scope="col" className="py-3.5 px-4">MEI</th>
                <th scope="col" className="py-3.5 px-4">Redução IVA</th>
                <th scope="col" className="py-3.5 px-4">Simulador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((cnae) => (
                <tr key={cnae.codigoLimpo} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                    <Link href={`/cnae/${cnae.slug}`} className="hover:underline">
                      {cnae.codigo}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/cnae/${cnae.slug}`}
                      className="font-semibold text-slate-900 hover:text-blue-700 block"
                    >
                      {cnae.nomePopular}
                    </Link>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {cnae.titulo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-800 text-xs">
                      Anexo {cnae.anexo} ({(cnae.aliquotaInicialNominal * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {cnae.fatorR ? (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Cai p/ 6% (Anexo III)
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
                        <Check className="w-3.5 h-3.5" /> Sim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                        <Minus className="w-3.5 h-3.5" /> Não
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {cnae.reducaoIVA2026 > 0 ? (
                      <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        -{(cnae.reducaoIVA2026 * 100).toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Padrão</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      href={`/cnae/${cnae.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Calcular <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm space-y-3">
                    <p>
                      Nenhum CNAE encontrado{busca ? ` para "${busca}"` : ""}. Ajuste os termos ou limpe os filtros aplicados.
                    </p>
                    <button
                      type="button"
                      onClick={limparFiltros}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-blue-700 transition-colors"
                    >
                      Limpar busca e filtros
                    </button>
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
