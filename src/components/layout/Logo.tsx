import { Link } from 'react-router-dom'

interface LogoProps {
  footer?: boolean
}

export function Logo({ footer = false }: LogoProps) {
  return (
    <Link
      className={`brand-mark${footer ? ' footer-brand' : ''}`}
      to="/catalog"
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
    </Link>
  )
}
