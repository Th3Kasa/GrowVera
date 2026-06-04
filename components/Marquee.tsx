"use client";

interface MarqueeProps {
  items: string[];
  className?: string;
  separator?: string;
}

export default function Marquee({ items, className = "", separator = "·" }: MarqueeProps) {
  const repeated = [...items, ...items];
  return (
    <div className={`marquee-container overflow-hidden ${className}`} aria-hidden="true">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8 px-4">
            <span className="text-sm font-medium tracking-wide">{item}</span>
            <span className="opacity-30 text-xs">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
