export function Logo({ footer = false }) {
  return (
    <a
      className={`brand-mark${footer ? ' footer-brand' : ''}`}
      href="#home"
      aria-label="СтройБаза, на главную"
    >
      <span className="brand-symbol">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-name">
        <span className="brand-word">
          строй<span>база</span>
        </span>
        <small>МАТЕРИАЛЫ ДЛЯ ДЕЛА</small>
      </span>
    </a>
  )
}
