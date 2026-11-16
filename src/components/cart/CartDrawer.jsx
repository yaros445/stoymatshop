import { formatPrice } from '../../utils/formatPrice.js'
import { getImageUrl } from '../../utils/image.js'
import { Icon } from '../ui/Icon.jsx'

export function CartDrawer({
  cart,
  cartCount,
  cartTotal,
  isOpen,
  products,
  onChangeQuantity,
  onCheckout,
  onClose,
}) {
  if (!isOpen) return null

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="side-drawer" aria-label="Корзина">
        <div className="drawer-heading">
          <div>
            <span className="eyebrow">ВАШ ЗАКАЗ</span>
            <h2>Корзина <span>{cartCount}</span></h2>
          </div>
          <button className="close-button" type="button" aria-label="Закрыть корзину" onClick={onClose}>
            <Icon name="close" size={21} />
          </button>
        </div>
        {cartCount === 0 ? (
          <div className="drawer-empty">
            <span><Icon name="cart" size={27} /></span>
            <strong>Пока здесь пусто</strong>
            <p>Добавьте товары из каталога, и мы соберём ваш заказ.</p>
            <button className="button button-primary" type="button" onClick={onClose}>Перейти к покупкам</button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {products.filter((product) => cart[product.id]).map((product) => (
                <div className="drawer-product" key={product.id}>
                  <img src={getImageUrl(product.image, 160, 70)} alt="" />
                  <div className="drawer-product-info">
                    <strong>{product.title}</strong>
                    <small>{formatPrice(product.price)} / шт.</small>
                    <div className="quantity-control">
                      <button type="button" aria-label="Уменьшить количество" onClick={() => onChangeQuantity(product.id, -1)}>−</button>
                      <span>{cart[product.id]}</span>
                      <button type="button" aria-label="Увеличить количество" onClick={() => onChangeQuantity(product.id, 1)}>+</button>
                    </div>
                  </div>
                  <b>{formatPrice(product.price * cart[product.id])}</b>
                </div>
              ))}
            </div>
            <div className="drawer-total">
              <span>Итого без доставки</span>
              <strong>{formatPrice(cartTotal)}</strong>
              <button className="button button-primary" type="button" onClick={onCheckout}>
                Оформить заказ <Icon name="arrow" size={17} />
              </button>
              <small>Точная стоимость доставки будет рассчитана менеджером</small>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
