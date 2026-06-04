"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Globe, Star } from "@phosphor-icons/react";

export default function GBPCard() {
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
        {/* Map image area */}
        <div
          className="relative h-32 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #d1e8d8 0%, #b8d9c3 40%, #c8e4d0 100%)",
          }}
        >
          {/* Subtle map grid lines */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
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
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Simulated roads */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="#fff"
              strokeWidth="3"
            />
            <line
              x1="40%"
              y1="0"
              x2="40%"
              y2="100%"
              stroke="#fff"
              strokeWidth="2"
            />
            <line
              x1="70%"
              y1="0"
              x2="60%"
              y2="100%"
              stroke="#fff"
              strokeWidth="1.5"
            />
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
              style={{
                width: "12px",
                height: "4px",
                background: "#1A5C3A",
              }}
            />
          </div>

          {/* Rank #1 badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md"
            style={{ background: "#1A5C3A", color: "#fff" }}
          >
            <span>#1</span>
            <span>Local Pack</span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4">
          {/* Business name + category */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3
                className="text-base font-bold leading-tight"
                style={{ color: "#0D0D0B", fontFamily: "var(--font-outfit)" }}
              >
                GrowVera Dental
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: "#6B6B67" }}>
                Dental clinic · Open now
              </p>
            </div>
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
              style={{ background: "#E8F2EC" }}
            >
              <span className="text-base">🦷</span>
            </div>
          </div>

          {/* Stars + review count */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={13}
                  weight="fill"
                  color="#F5A623"
                />
              ))}
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "#0D0D0B" }}
            >
              4.9
            </span>
            <span className="text-[11px]" style={{ color: "#6B6B67" }}>
              (127 reviews)
            </span>
          </div>

          {/* Divider */}
          <div
            className="mb-3"
            style={{ height: "1px", background: "rgba(13,13,11,0.06)" }}
          />

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin size={12} style={{ color: "#6B6B67" }} />
              <span className="text-[11px]" style={{ color: "#6B6B67" }}>
                42 Crown St, Surry Hills NSW 2010
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} style={{ color: "#6B6B67" }} />
              <span className="text-[11px]" style={{ color: "#6B6B67" }}>
                (02) 9000 0000
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={12} style={{ color: "#6B6B67" }} />
              <span
                className="text-[11px] font-medium"
                style={{ color: "#1A5C3A" }}
              >
                growveradental.com.au
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition-colors"
              style={{
                background: "#1A5C3A",
                color: "#fff",
              }}
            >
              Book appointment
            </button>
            <button
              className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition-colors"
              style={{
                background: "#E8F2EC",
                color: "#1A5C3A",
              }}
            >
              Directions
            </button>
          </div>
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
