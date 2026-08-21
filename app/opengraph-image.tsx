import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PhishGuard — Oltalama Farkındalık Simülasyonu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#F4EEE3",
          color: "#211C15",
        }}
      >
        {/* masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #E1D8C6",
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 34,
              fontWeight: 600,
            }}
          >
            PhishGuard<span style={{ color: "#C0391F" }}>.</span>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#8C8471",
            }}
          >
            Farkındalık Simülasyonu
          </div>
        </div>

        {/* başlık */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#C0391F",
            }}
          >
            Oltalama · Vishing · Smishing
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 92,
              fontWeight: 600,
              lineHeight: 1.05,
              marginTop: 20,
              letterSpacing: -1,
            }}
          >
            Oltayı yutma.{" "}
            <span style={{ fontStyle: "italic", color: "#C0391F" }}>Tanı</span>,
            ve geç.
          </div>
        </div>

        {/* alt bilgi */}
        <div
          style={{
            display: "flex",
            gap: 48,
            borderTop: "1px solid #E1D8C6",
            paddingTop: 24,
            fontSize: 26,
            color: "#575040",
          }}
        >
          <div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 600 }}>
              42
            </span>{" "}
            Senaryo
          </div>
          <div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 600 }}>
              3
            </span>{" "}
            Kanal
          </div>
          <div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 600 }}>
              10
            </span>{" "}
            Taktik
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
