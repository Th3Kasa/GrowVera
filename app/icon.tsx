import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A5C3A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          fontSize: 14,
          fontWeight: 900,
          color: "white",
          letterSpacing: "-0.5px",
          fontFamily: "serif",
        }}
      >
        GV
      </div>
    ),
    { ...size }
  );
}
