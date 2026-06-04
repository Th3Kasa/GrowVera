export default function Logo({ size = 'sm', dark = false }: { size?: 'sm' | 'lg'; dark?: boolean }) {
  const fontSize = size === 'lg' ? 26 : 17

  return (
    <span
      aria-label="GrowVera"
      style={{
        fontFamily: "var(--font-cabinet), Outfit, Georgia, serif",
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: dark ? '#ffffff' : '#0D0D0B' }}>Grow</span>
      <span style={{ color: '#1A5C3A' }}>Vera</span>
    </span>
  )
}
