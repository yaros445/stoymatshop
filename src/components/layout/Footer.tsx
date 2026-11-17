import { Link } from 'react-router-dom'
import { contacts } from '../../data/contacts.ts'
import { Icon } from '../ui/Icon.tsx'
import { Logo } from './Logo.tsx'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-about">
          <Logo footer />
          <p>
            Надёжная база для больших планов. Материалы, инструменты и доставка для стройки без лишних забот.
          </p>
          <div className="social-links">
            <a href="https://t.me/" aria-label="Telegram">tg</a>
            <a href="https://www.instagram.com/" aria-label="Instagram">ig</a>
            <a href="https://vk.com/" aria-label="ВКонтакте">вк</a>
          </div>
        </div>
        <div className="footer-column">
          <strong>Покупателям</strong>
          <Link to="/catalog">Каталог товаров</Link>
          <Link to="/delivery">Доставка и оплата</Link>
          <Link to="/calculator">Калькулятор материалов</Link>
          <Link to="/reviews">Отзывы клиентов</Link>
        </div>
        <div className="footer-column">
          <strong>Контакты</strong>
          <a href={contacts.phoneHref}>{contacts.phone}</a>
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
          <span><Icon name="location" size={15} /> {contacts.address}</span>
          <span><Icon name="clock" size={15} /> {contacts.hours}</span>
        </div>
        <div className="footer-column payment-column">
          <strong>Оплата</strong>
          <p>Наличные, карта, безналичный расчёт для юрлиц</p>
          <div className="payment-methods">
            <span>VISA</span>
            <span>МИР</span>
            <span>ЕРИП</span>
          </div>
          <div className="legal-note">
            {contacts.companyName}
            <br />
            {contacts.taxNumber}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} СтройБаза. Все права защищены.</span>
        <a href={`mailto:${contacts.email}`}>Политика конфиденциальности</a>
        <span>Цены указаны в белорусских рублях</span>
      </div>
    </footer>
  )
}
