import React from "react";
import type { FAQItem } from "@/lib/seo-schema";

export default function PageFAQSection({
  faqs,
  title = "Perguntas frequentes (2026)",
}: {
  faqs: FAQItem[];
  title?: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="divide-y divide-slate-100">
        {faqs.map((item, idx) => (
          <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              {item.question}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
