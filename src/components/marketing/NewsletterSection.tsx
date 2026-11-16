import { Icon } from '../ui/Icon.tsx'
import type { FormEvent } from 'react'

export function NewsletterSection() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.currentTarget.reset()
  }

  return (
    <section className="newsletter-section">
      <div className="container newsletter-inner">
        <span className="newsletter-mark">
          <Icon name="mail" size={23} />
        </span>
        <div>
          <strong>Полезное для вашего проекта</strong>
          <small>Расчёты, советы и закрытые предложения раз в неделю</small>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Ваш email" aria-label="Ваш email" required />
          <button type="submit" aria-label="Подписаться">
            <Icon name="arrow" size={19} />
          </button>
        </form>
      </div>
    </section>
  )
}
