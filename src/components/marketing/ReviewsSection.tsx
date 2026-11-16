import { contacts } from '../../data/contacts.ts'
import { partners } from '../../data/partners.ts'
import { ratingSummary, reviews } from '../../data/reviews.ts'
import { Icon } from '../ui/Icon.tsx'

export function ReviewsSection() {
  return (
    <section className="reviews-section section-space" id="reviews">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">НАС РЕКОМЕНДУЮТ</span>
            <h2>Слова тех, кто строит</h2>
          </div>
          <a className="text-link" href={`mailto:${contacts.email}`}>
            Все отзывы <Icon name="arrow" size={17} />
          </a>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.author}>
              <div className="review-stars">
                ★★★★★ <span>{review.rating}</span>
              </div>
              <p>{review.text}</p>
              <div className="review-author">
                <span className={`review-avatar ${review.avatarClass}`}>{review.initials}</span>
                <span>
                  <strong>{review.author}</strong>
                  <small>{review.description}</small>
                </span>
                <small className="review-date">{review.date}</small>
              </div>
            </article>
          ))}
          <article className="review-score">
            <span className="eyebrow">СРЕДНЯЯ ОЦЕНКА</span>
            <strong>
              {ratingSummary.score}
              <span>/5</span>
            </strong>
            <div className="review-stars">★★★★★</div>
            <p>
              На основе {ratingSummary.reviews.toLocaleString('ru-RU')} отзывов
              <br />
              на картах и в магазине
            </p>
            <div className="rating-bars">
              {ratingSummary.distribution.map((item) => (
                <span key={item.stars}>
                  {item.stars}{' '}
                  <i>
                    <b style={{ width: `${item.percent}%` }} />
                  </i>{' '}
                  {item.percent}%
                </span>
              ))}
            </div>
          </article>
        </div>
        <div className="partners-row">
          <span>НАМ ДОВЕРЯЮТ ПРОИЗВОДИТЕЛИ</span>
          <div className="partner-logos">
            {partners.map((partner) => (
              <strong className={partner.className ?? ''} key={partner.name}>
                {partner.name}
              </strong>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
