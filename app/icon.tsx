import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg,#d4af37 0%,#f6c343 50%,#a07a1f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontWeight: 700,
          fontSize: 22,
          color: "#1a1405",
          letterSpacing: -1,
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}
