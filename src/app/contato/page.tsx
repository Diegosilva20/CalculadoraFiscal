"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Check, Copy, ExternalLink } from "lucide-react";

const DESTINATARIO_EMAIL = "contato@calculafiscal.com.br";

export default function ContatoPage() {
  const [preparado, setPreparado] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("Sugestão de Nova Calculadora / CNAE");
  const [mensagem, setMensagem] = useState("");

  const corpoFormatado = `Nome: ${nome}\nE-mail de resposta: ${email}\nAssunto: ${assunto}\n\nMensagem:\n${mensagem}`;

  const mailtoHref = `mailto:${DESTINATARIO_EMAIL}?subject=${encodeURIComponent(
    `[CalculaFiscal] ${assunto}`
  )}&body=${encodeURIComponent(corpoFormatado)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreparado(true);
    window.location.href = mailtoHref;
  };

  const copiarMensagem = () => {
    navigator.clipboard?.writeText(
      `Para: ${DESTINATARIO_EMAIL}\nAssunto: [CalculaFiscal] ${assunto}\n\n${corpoFormatado}`
    );
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-9 space-y-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          Atendimento editorial e comercial
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Fale Conosco — CalculaFiscal
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Encontrou alguma divergência em alíquotas ou regras de 2026, quer sugerir a inclusão de um novo CNAE ou tratar sobre parcerias? Preencha os campos abaixo para abrir a mensagem no seu aplicativo de e-mail ou copiar o texto formatado.
        </p>

        {preparado ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-4">
            <div className="font-bold text-base text-slate-900">
              Rascunho preparado para envio por e-mail
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Caso o seu programa de e-mail não tenha aberto automaticamente, utilize um dos atalhos abaixo para enviar diretamente para <strong>{DESTINATARIO_EMAIL}</strong>:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir aplicativo de e-mail
              </a>
              <button
                type="button"
                onClick={copiarMensagem}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm transition-colors"
              >
                {copiado ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    Texto copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar mensagem e destinatário
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPreparado(false)}
                className="text-xs font-semibold text-slate-600 underline px-2 py-2"
              >
                Editar formulário
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contato-nome"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Seu nome
                </label>
                <input
                  id="contato-nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: João Silva"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="contato-email"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Seu e-mail
                </label>
                <input
                  id="contato-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com.br"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contato-assunto"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Assunto
              </label>
              <select
                id="contato-assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option>Sugestão de Nova Calculadora / CNAE</option>
                <option>Dúvida ou Revisão de Alíquota Fiscal 2026</option>
                <option>Publicidade Direta / Parceria Contábil B2B</option>
                <option>Privacidade de Dados (LGPD)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contato-mensagem"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Mensagem
              </label>
              <textarea
                id="contato-mensagem"
                rows={4}
                required
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva sua sugestão, código CNAE ou dúvida..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              Preparar envio por e-mail
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-slate-600" />
            Canal institucional: <strong>{DESTINATARIO_EMAIL}</strong>
          </span>
          <span>Atendimento em dias úteis (horário comercial de Brasília)</span>
        </div>
      </div>
    </div>
  );
}
