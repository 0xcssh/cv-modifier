import { ImageResponse } from "next/og";

// Image metadata
export const alt = "CV Modifier — Adaptez votre CV en 30 secondes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image generation
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: "#60a5fa",
            marginBottom: 24,
            fontWeight: 600,
            display: "flex",
          }}
        >
          CV <span style={{ color: "white", marginLeft: 8 }}>Modifier</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 32,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span>Adaptez votre CV à chaque offre&nbsp;</span>
          <span style={{ color: "#60a5fa" }}>en 30 secondes</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#cbd5e1",
            textAlign: "center",
            display: "flex",
          }}
        >
          CV + lettre de motivation par IA · Optimisé ATS
        </div>
      </div>
    ),
    size,
  );
}
