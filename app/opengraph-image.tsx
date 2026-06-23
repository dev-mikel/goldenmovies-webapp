import { ImageResponse } from "next/og";

export const alt = "GoldenMovies — Premium cinematic experience";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(120% 90% at 78% 30%,rgba(60,40,70,.55),transparent 60%),radial-gradient(90% 120% at 10% 80%,rgba(40,30,15,.6),transparent 55%),linear-gradient(115deg,#15131a 0%,#0c0b0f 55%,#100d08 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#d4af37 0%,#f6c343 50%,#a07a1f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 36,
              color: "#1a1405",
            }}
          >
            G
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 1,
              color: "rgba(212,175,55,.95)",
            }}
          >
            GoldenMovies
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -2,
            fontStyle: "italic",
            fontFamily: "serif",
            color: "white",
            marginBottom: 24,
          }}
        >
          <span style={{ display: "flex" }}>
            <span>Your premium&nbsp;</span>
            <span style={{ color: "#f6c343" }}>cinematic</span>
          </span>
          <span>experience awaits</span>
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,.65)",
            fontWeight: 400,
          }}
        >
          Cartelera · Sedes · Asientos en tiempo real
        </div>
      </div>
    ),
    { ...size },
  );
}
