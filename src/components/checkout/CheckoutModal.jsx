import { useState } from 'react'
import { createId, saveDemoData } from '../account/demoAccountStorage.js'
import { formatPriceCents } from '../../utils/formatPrice.js'
import { pluralizeProducts } from '../../utils/pluralize.js'
import { Icon } from '../ui/Icon.jsx'
import { OrderConfirmationModal } from './OrderConfirmationModal.jsx'

export function CheckoutModal({
  cart,
  cartCount,
  cartTotalCents,
  currentUser,
  demoData,
  isOpen,
  onCartClear,
  onClose,
  onDemoDataChange,
  products,
}) {
  const [error, setError] = useState('')
  const [completedOrder, setCompletedOrder] = useState(null)
  const productsById = new Map(products.map((product) => [product.id, product]))

  function closeCheckout() {
    setError('')
    onClose()
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name')).trim()
    const phone = String(formData.get('phone')).trim()
    const address = String(formData.get('address')).trim()
    if (!name || !address) {
      setError('Укажите имя и адрес доставки.')
      return
    }
    if (!/^375\d{9}$/.test(phone.replace(/\D/g, ''))) {
      setError('Укажите белорусский номер телефона в формате +375 (XX) XXX-XX-XX.')
      return
    }

    const cartEntries = Object.entries(cart).filter(([, quantity]) => quantity > 0)
    const items = cartEntries.map(([productId, quantity]) => {
      const product = productsById.get(Number(productId))
      if (!product) return null
      return {
        id: product.id,
        title: product.title,
        quantity,
        price: Math.round(product.price * 100) / 100,
      }
    }).filter(Boolean)

    if (items.length === 0) {
      setError('Корзина пуста. Добавьте товары и попробуйте снова.')
      return
    }
    if (items.length !== cartEntries.length) {
      setError('Не удалось проверить товары в корзине. Обновите страницу и попробуйте снова.')
      return
    }

    try {
      const order = {
        id: `SB-${createId().toUpperCase()}`,
        userId: currentUser?.id ?? null,
        createdAt: new Date().toISOString(),
        name,
        phone,
        address,
        comment: String(formData.get('comment')).trim(),
        payment: 'При получении',
        items,
        total: cartTotalCents / 100,
      }
      const nextData = { ...demoData, orders: [order, ...demoData.orders] }
      saveDemoData(nextData)
      onDemoDataChange(nextData)
      onCartClear()
      setCompletedOrder(order)
      onClose()
    } catch (saveError) {
      console.error('Не удалось сохранить заказ:', saveError)
      setError('Не удалось сохранить заказ в этом браузере. Попробуйте ещё раз.')
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
              <label>Имя<input name="name" type="text" autoComplete="name" defaultValue={currentUser?.name ?? ''} minLength="2" required /></label>
              <label>Телефон<input name="phone" type="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" required /></label>
              <label>Адрес доставки<input name="address" type="text" autoComplete="street-address" placeholder="Город, улица, дом" required /></label>
              <label>Комментарий к заказу<textarea name="comment" rows="2" placeholder="Подъезд, удобное время и другие детали" /></label>
              <div className="payment-note">
                <strong>Оплата при получении</strong>
                <span>Наличными или картой при доставке</span>
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-primary" type="submit">Подтвердить заказ <Icon name="arrow" size={17} /></button>
            </form>
            <small>Демо-режим: заказ сохранится только в этом браузере; продавцу он не отправляется.</small>
          </section>
        </div>
      )}
      <OrderConfirmationModal order={completedOrder} onClose={() => setCompletedOrder(null)} />
    </>
  )
}
