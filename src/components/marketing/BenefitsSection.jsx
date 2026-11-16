import { benefits } from '../../data/benefits.js'
import { Icon } from '../ui/Icon.jsx'

export function BenefitsSection() {
  return (
    <section className="benefits-section section-space" id="benefits">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">С НАМИ СПОКОЙНО</span>
            <h2>Почему выбирают СтройБазу</h2>
          </div>
          <p className="heading-note">
            Делаем стройку предсказуемой: от первого расчёта до разгрузки на объекте.
          </p>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article key={benefit.number}>
              <span className="benefit-icon">
                <Icon name={benefit.icon} size={26} />
              </span>
              <span className="benefit-number">{benefit.number}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
