"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, CheckCircle2, Send } from "lucide-react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("Sugestão de Nova Calculadora / CNAE");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          <Mail className="w-3.5 h-3.5" />
          Atendimento Editorial & Parcerias B2B
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Fale Conosco — CalculaFiscal
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Encontrou alguma divergência em uma alíquota municipal, quer sugerir a inclusão de um novo CNAE/profissão ou deseja anunciar sua empresa contábil/financeira diretamente no portal? Envie sua mensagem abaixo:
        </p>

        {enviado ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-base text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
              Mensagem registrada com sucesso!
            </div>
            <p className="text-xs sm:text-sm">
              Obrigado pelo contato, <strong>{nome}</strong>. Nossa equipe técnica analisa todas as sugestões de atualização de tabelas fiscais e solicitações comerciais em até 24 horas úteis.
            </p>
            <button
              type="button"
              onClick={() => {
                setEnviado(false);
                setMensagem("");
              }}
              className="mt-2 text-xs font-bold text-emerald-700 underline"
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: João Silva"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com.br"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assunto
              </label>
              <select
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option>Sugestão de Nova Calculadora / CNAE</option>
                <option>Dúvida ou Revisão de Alíquota Fiscal 2026</option>
                <option>Publicidade Direta / Parceria Contábil B2B</option>
                <option>Privacidade de Dados (LGPD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mensagem
              </label>
              <textarea
                rows={4}
                required
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva sua sugestão, código CNAE ou dúvida..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar Mensagem
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            E-mail Institucional: <strong>contato@calculafiscal.com.br</strong>
          </span>
          <span>Atendimento: Segunda a Sexta, das 9h às 18h (Horário de Brasília)</span>
        </div>
      </div>
    </div>
  );
}
