"use client";

import { motion } from "framer-motion";
import { MapPin, Star } from "@phosphor-icons/react";

const rows = [
  { rank: 1, stars: 5, reviews: "47 reviews", nameWidth: "w-24" },
  { rank: 2, stars: 4, reviews: "31 reviews", nameWidth: "w-20" },
  { rank: 3, stars: 4, reviews: "18 reviews", nameWidth: "w-16" },
];

export default function RankVisual() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Soft green radial glow behind the card */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-40px",
          background:
            "radial-gradient(ellipse at center, rgba(26,92,58,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Card shell */}
      <div
        className="relative z-10 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.14)]"
        style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)" }}
      >
        {/* Map area */}
        <div
          className="relative h-28 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #d1e8d8 0%, #b8d9c3 40%, #c8e4d0 100%)",
          }}
        >
          {/* Grid lines */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="rank-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="#1A5C3A"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rank-grid)" />
          </svg>

          {/* Simulated roads */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" strokeWidth="3" />
            <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#fff" strokeWidth="2" />
            <line x1="70%" y1="0" x2="60%" y2="100%" stroke="#fff" strokeWidth="1.5" />
          </svg>

          {/* Map pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full shadow-lg"
              style={{ background: "#1A5C3A" }}
            >
              <MapPin size={18} weight="fill" color="#fff" />
            </div>
            <div
              className="mx-auto mt-0.5 rounded-full opacity-30"
              style={{ width: "12px", height: "4px", background: "#1A5C3A" }}
            />
          </div>

          {/* #1 Local Pack badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md"
            style={{ background: "#1A5C3A", color: "#fff" }}
          >
            <span>#1</span>
            <span>Local Pack</span>
          </div>
        </div>

        {/* Local pack result rows */}
        <div className="divide-y" style={{ borderColor: "rgba(13,13,11,0.06)" }}>
          {rows.map((row) => (
            <div
              key={row.rank}
              className="flex items-center gap-3 px-4 py-3"
            >
              {/* Rank badge — only shown for #1 */}
              {row.rank === 1 ? (
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[9px] font-bold"
                  style={{ background: "#1A5C3A", color: "#fff" }}
                >
                  1
                </div>
              ) : (
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-[9px] font-semibold"
                  style={{
                    background: "rgba(13,13,11,0.06)",
                    color: "#9E9E9A",
                  }}
                >
                  {row.rank}
                </div>
              )}

              {/* Pin */}
              <MapPin
                size={11}
                weight="fill"
                style={{ color: "#9E9E9A", flexShrink: 0 }}
              />

              {/* Business name placeholder bar */}
              <div
                className={`rounded ${row.nameWidth} h-3 flex-shrink-0`}
                style={{ background: "#E2E1DC" }}
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
                {Array.from({ length: row.stars }).map((_, i) => (
                  <Star key={i} size={9} weight="fill" color="#F5A623" />
                ))}
              </div>

              {/* Review count */}
              <span
                className="text-[9px] flex-shrink-0"
                style={{ color: "#9E9E9A" }}
              >
                {row.reviews}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary card peeking behind (depth illusion) */}
      <div
        aria-hidden="true"
        className="absolute -bottom-3 left-4 right-4 h-full rounded-2xl -z-10"
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          transform: "scale(0.96)",
        }}
      />
    </motion.div>
  );
}
