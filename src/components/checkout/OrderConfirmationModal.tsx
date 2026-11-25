import { formatPriceCents } from '../../utils/formatPrice.ts'
import { Icon } from '../ui/Icon.tsx'
import type { ApiOrder } from '../../api/client.ts'

interface OrderConfirmationModalProps {
  order: ApiOrder | null
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
        <span className="eyebrow">ЗАКАЗ ПРИНЯТ</span>
        <h2>Спасибо за заказ!</h2>
        <p>Номер заказа: <strong>{order.orderNumber}</strong></p>
        <div className="checkout-summary">
          <span>К оплате при получении</span>
          <strong>{formatPriceCents(order.totalCents)}</strong>
        </div>
        <small>Заказ сохранён в базе магазина. Если вы вошли в аккаунт, он появится в истории заказов.</small>
        <button className="button button-primary" type="button" onClick={onClose}>Продолжить покупки</button>
      </section>
    </div>
  )
}
