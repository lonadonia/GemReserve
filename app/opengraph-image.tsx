import { ImageResponse } from "next/og";

export const alt = "GemReserve.io — Real Gems. Real Value. Real Trust.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 70% 45%, #142c31 0%, #061018 38%, #020608 72%)",
        color: "#f3efe6",
        display: "flex",
        height: "100%",
        justifyContent: "space-between",
        padding: "76px 90px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
        <div style={{ color: "#e5aa39", fontSize: 28, letterSpacing: 5 }}>
          THE FUTURE OF GEMSTONE OWNERSHIP
        </div>
        <div style={{ fontFamily: "serif", fontSize: 88, lineHeight: 1.02 }}>
          Real Gems. Real Value. Real Trust.
        </div>
        <div style={{ color: "#b8c0c4", fontSize: 25, marginTop: 28 }}>
          Built on trust. Backed by gems.
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          border: "3px solid #d89a27",
          borderRadius: 36,
          color: "#f3c15a",
          display: "flex",
          fontFamily: "serif",
          fontSize: 62,
          height: 250,
          justifyContent: "center",
          width: 220,
        }}
      >
        GR
      </div>
    </div>,
    size,
  );
}
