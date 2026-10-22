import { ImageResponse } from "next/og";

export const alt =
  "CalculaFiscal 2026 — Calculadora CLT vs PJ, Tabela CNAE, Fator R e Salário Líquido";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b1120",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.12) 2%, transparent 0%)",
          backgroundSize: "40px 40px",
          padding: "64px 72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Topo: Marca + Selo 2026 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 900,
                color: "#ffffff",
              }}
            >
              CF
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                CalculaFiscal 2026
              </span>
              <span style={{ fontSize: "16px", color: "#94a3b8" }}>
                Inteligência Tributária, Trabalhista e Financeira
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.18)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              color: "#34d399",
              padding: "10px 20px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Isenção IRPF R$ 5k • Fator R 6% • Reforma CBS/IBS
          </div>
        </div>

        {/* Centro: Headline de Alto Impacto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: "62px",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Descubra quanto sobra no seu bolso em 2026: CLT ou PJ?
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#cbd5e1",
              lineHeight: 1.4,
            }}
          >
            Compare Salário Líquido vs CNPJ até o último centavo, consulte todos
            os CNAEs do Simples Nacional e simule o Fator R (28%).
          </div>
        </div>

        {/* Rodapé: Pílulas das Ferramentas */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.25)",
              border: "1px solid rgba(96, 165, 250, 0.35)",
              padding: "16px 24px",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#93c5fd",
            }}
          >
            ⚡ Simulador CLT vs PJ
          </div>
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              border: "1px solid rgba(52, 211, 153, 0.35)",
              padding: "16px 24px",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#6ee7b7",
            }}
          >
            📊 Tabela CNAE & Fator R (6%)
          </div>
          <div
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              padding: "16px 24px",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#fcd34d",
            }}
          >
            🏢 Custo de Funcionário & Rescisão
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
