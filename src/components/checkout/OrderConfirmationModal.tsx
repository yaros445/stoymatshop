import { formatPrice } from '../../utils/formatPrice.ts'
import { Icon } from '../ui/Icon.tsx'
import type { DemoOrder } from '../../types.ts'

interface OrderConfirmationModalProps {
  order: DemoOrder | null
  onClose: () => void
}

export function OrderConfirmationModal({ order, onClose }: OrderConfirmationModalProps) {
  if (!order) return null

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="account-modal order-success" aria-label="Заказ оформлен">
        <button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" size={21} />
        </button>
        <span className="modal-icon"><Icon name="check" size={23} /></span>
        <span className="eyebrow">ЗАКАЗ СОХРАНЁН</span>
        <h2>Спасибо за заказ!</h2>
        <p>Номер заказа: <strong>{order.id}</strong></p>
        <div className="checkout-summary">
          <span>К оплате при получении</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
        <small>Это демо-заказ, он сохранён только в вашем браузере и не отправлен продавцу.</small>
        <button className="button button-primary" type="button" onClick={onClose}>Продолжить покупки</button>
      </section>
    </div>
  )
}
