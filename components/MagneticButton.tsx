"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, useSpring, type Transition } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  strength?: number;
  as?: "button" | "a";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

export default function MagneticButton({
  children,
  className = "",
  style,
  onClick,
  href,
  strength = 0.3,
  as: Tag = "button",
  type = "button",
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const springY = useSpring(y, { stiffness: 350, damping: 25 });

  const translateX = useTransform(springX, (v) => v * strength * 40);
  const translateY = useTransform(springY, (v) => v * strength * 40);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) / (rect.width / 2));
    y.set((e.clientY - cy) / (rect.height / 2));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const springTransition: Transition = { type: "spring", stiffness: 350, damping: 25 };

  const motionStyle = { x: translateX, y: translateY };

  if (Tag === "a" && href) {
    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block" }}
      >
        <motion.a
          href={href}
          className={className}
          style={{ ...style, ...motionStyle }}
          aria-label={ariaLabel}
          whileTap={{ scale: 0.97 }}
          transition={springTransition}
        >
          {children}
        </motion.a>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
    >
      <motion.button
        type={type}
        className={className}
        style={{ ...style, ...motionStyle }}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.97 }}
        transition={springTransition}
      >
        {children}
      </motion.button>
    </div>
  );
}
