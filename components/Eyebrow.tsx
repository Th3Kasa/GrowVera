export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-6">
      <div className="w-0.5 h-3 bg-[#1A5C3A] rounded-full" />
      <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#1A5C3A]">
        {children}
      </span>
    </div>
  )
}
