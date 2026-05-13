import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Moneyzin — Controle financeiro pessoal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 100,
            padding: "6px 18px",
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#10b981", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>
            CONTROLE FINANCEIRO PESSOAL
          </span>
        </div>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              background: "#10b981",
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ color: "white", fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>
            Moneyzin
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Suas finanças,{" "}
          <span style={{ color: "#10b981" }}>simplificadas.</span>
        </div>

        {/* Subtitle */}
        <div style={{ color: "#94a3b8", fontSize: 24, maxWidth: 680, lineHeight: 1.5 }}>
          Dashboard, transações, metas e relatórios em PDF e Excel — tudo em um só lugar.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #10b981, #059669)",
          }}
        />
      </div>
    ),
    size
  );
}
