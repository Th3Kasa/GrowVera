"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps { children: ReactNode; className?: string; delay?: number; y?: number; }

export default function ScrollReveal({ children, className, delay = 0, y = 24 }: ScrollRevealProps) {
  return (
    <motion.div className={className} initial={{ opacity: 1, y: 0 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] }}>
      {children}
    </motion.div>
  );
}

export const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
export const itemVariants = { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] } } };

interface StaggerContainerProps { children: ReactNode; className?: string; }
export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return <motion.div className={className} variants={containerVariants} initial="visible" whileInView="visible" viewport={{ once: true, amount: 0 }}>{children}</motion.div>;
}
export function StaggerItem({ children, className }: StaggerContainerProps) {
  return <motion.div className={className} variants={itemVariants}>{children}</motion.div>;
}
