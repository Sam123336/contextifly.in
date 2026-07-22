import { ImageResponse } from "next/og";

export const alt = "Contextifly: Give your AI a memory of your codebase";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card. Uses only the Satori-safe CSS subset (flexbox,
// solid colours) so it renders reliably at build time.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "#0a0b0d",
          color: "#f0f1f3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#45d0b8",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700 }}>Contextifly</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          Give your AI a memory of your codebase.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 34,
            color: "#9aa0ab",
            maxWidth: 940,
            lineHeight: 1.35,
          }}
        >
          A deterministic, full-stack code knowledge graph. 100% local,
          evidence-backed.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 26,
            color: "#63686f",
            letterSpacing: 1,
          }}
        >
          contextifly.in
        </div>
      </div>
    ),
    { ...size }
  );
}
