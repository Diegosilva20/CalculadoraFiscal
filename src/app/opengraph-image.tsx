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
          backgroundColor: "#0f172a",
          padding: "64px 72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
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
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                backgroundColor: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 900,
                color: "#ffffff",
              }}
            >
              CF
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                CalculaFiscal
              </span>
              <span style={{ fontSize: "16px", color: "#94a3b8" }}>
                Simuladores Trabalhistas e Tributários · 2026
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#e2e8f0",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "17px",
              fontWeight: 600,
            }}
          >
            IRPF 2026 · Fator R 28% · CBS e IBS
          </div>
        </div>

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
              fontSize: "58px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Calculadora CLT vs PJ, Tabela CNAE e Salário Líquido 2026
          </div>
          <div
            style={{
              fontSize: "25px",
              color: "#cbd5e1",
              lineHeight: 1.4,
            }}
          >
            Compare holerite CLT e lucro líquido no Simples Nacional com cálculo de INSS, IRRF, FGTS e alíquota efetiva.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              padding: "14px 22px",
              borderRadius: "10px",
              fontSize: "19px",
              fontWeight: 700,
              color: "#f8fafc",
            }}
          >
            Comparador CLT vs PJ
          </div>
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              padding: "14px 22px",
              borderRadius: "10px",
              fontSize: "19px",
              fontWeight: 700,
              color: "#34d399",
            }}
          >
            Tabela CNAE e Fator R
          </div>
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              padding: "14px 22px",
              borderRadius: "10px",
              fontSize: "19px",
              fontWeight: 700,
              color: "#f8fafc",
            }}
          >
            Custo CLT e Rescisão
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
