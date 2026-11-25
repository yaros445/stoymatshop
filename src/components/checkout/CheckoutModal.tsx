import { useState } from 'react'
import { submitOrder } from '../../api/client.ts'
import { formatPriceCents } from '../../utils/formatPrice.ts'
import { pluralizeProducts } from '../../utils/pluralize.ts'
import { Icon } from '../ui/Icon.tsx'
import { OrderConfirmationModal } from './OrderConfirmationModal.tsx'
import type { FormEvent } from 'react'
import type { Cart } from '../../types.ts'
import type { ApiOrder, ApiUser } from '../../api/client.ts'

interface CheckoutModalProps {
  cart: Cart
  cartCount: number
  cartTotalCents: number
  currentUser: ApiUser | null
  isOpen: boolean
  onCartClear: () => void
  onClose: () => void
  onOrderCreated: () => void
}

export function CheckoutModal({
  cart,
  cartCount,
  cartTotalCents,
  currentUser,
  isOpen,
  onCartClear,
  onClose,
  onOrderCreated,
}: CheckoutModalProps) {
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<ApiOrder | null>(null)

  function closeCheckout() {
    setError('')
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const items = Object.entries(cart)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId: Number(productId), quantity }))

    if (items.length === 0) {
      setError('Корзина пуста. Добавьте товары и попробуйте снова.')
      return
    }

    setSubmitting(true)
    try {
      const order = await submitOrder({
        customerName: String(formData.get('name')).trim(),
        customerPhone: String(formData.get('phone')).trim(),
        address: String(formData.get('address')).trim(),
        comment: String(formData.get('comment') ?? '').trim(),
        items,
      })
      onCartClear()
      onOrderCreated()
      setCompletedOrder(order)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error
        ? submitError.message
        : 'Не удалось оформить заказ. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCheckout() }}>
          <section className="account-modal checkout-modal" aria-label="Оформление заказа">
            <button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={closeCheckout}>
              <Icon name="close" size={21} />
            </button>
            <span className="modal-icon"><Icon name="cart" size={23} /></span>
            <span className="eyebrow">ОФОРМЛЕНИЕ ЗАКАЗА</span>
            <h2>Куда доставить?</h2>
            <p>Заполните контакты — менеджер свяжется с вами для уточнения доставки.</p>
            <div className="checkout-summary">
              <span>{pluralizeProducts(cartCount)}</span>
              <strong>{formatPriceCents(cartTotalCents)}</strong>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Имя<input name="name" type="text" autoComplete="name" defaultValue={currentUser?.name ?? ''} minLength={2} maxLength={120} required /></label>
              <label>Телефон<input name="phone" type="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" required /></label>
              <label>Адрес доставки<input name="address" type="text" autoComplete="street-address" placeholder="Город, улица, дом" minLength={5} maxLength={250} required /></label>
              <label>Комментарий к заказу<textarea name="comment" rows={2} maxLength={1000} placeholder="Подъезд, удобное время и другие детали" /></label>
              <div className="payment-note">
                <strong>Оплата при получении</strong>
                <span>Наличными или картой при доставке</span>
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-primary" type="submit" disabled={submitting}>
                {submitting ? 'Оформляем…' : 'Подтвердить заказ'} <Icon name="arrow" size={17} />
              </button>
            </form>
            <small>Наличие и итоговая стоимость проверяются сервером. Заказ будет сохранён в базе магазина.</small>
          </section>
        </div>
      )}
      <OrderConfirmationModal order={completedOrder} onClose={() => setCompletedOrder(null)} />
    </>
  )
}
