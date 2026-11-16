import { ALL_BRANDS, ALL_CATEGORIES, BADGES, TABS } from '../../constants/filters.js'
import { categories } from '../../data/categories.js'
import { MAX_PRICE_CENTS, MIN_PRICE_CENTS, productBrands, products } from '../../data/products.js'
import { formatPriceCents } from '../../utils/formatPrice.js'
import { getImageUrl } from '../../utils/image.js'
import { pluralizeProducts } from '../../utils/pluralize.js'
import { Icon } from '../ui/Icon.jsx'

export function CatalogSection({
  activeCategory,
  activeTab,
  brand,
  cart,
  dispatchFilters,
  favorites,
  filteredProducts,
  inStockOnly,
  maxPriceCents,
  onAddToCart,
  onResetFilters,
  onToggleFavorite,
  showFavorites,
}) {
  return (
    <section className="products-section section-space" id="catalog">
      <div className="container">
        <div className="section-heading product-heading">
          <div>
            <span className="eyebrow">ТОЛЬКО ПРОВЕРЕННОЕ</span>
            <h2>{showFavorites ? 'Избранное' : activeCategory === ALL_CATEGORIES ? 'Выбор наших клиентов' : categories.find((category) => category.id === activeCategory)?.title}</h2>
          </div>
          <div className="product-tabs">
            <button className={activeTab === TABS.ALL ? 'is-selected' : ''} type="button" onClick={() => dispatchFilters({ type: 'setTab', value: TABS.ALL })}>Все товары</button>
            <button className={activeTab === TABS.BESTSELLERS ? 'is-selected' : ''} type="button" onClick={() => dispatchFilters({ type: 'setTab', value: TABS.BESTSELLERS })}>Хиты продаж</button>
            <button className={activeTab === TABS.NEW ? 'is-selected' : ''} type="button" onClick={() => dispatchFilters({ type: 'setTab', value: TABS.NEW })}>Новинки <span>NEW</span></button>
          </div>
        </div>
        <div className="catalog-tools">
          <span>{pluralizeProducts(filteredProducts.length)}</span>
          <label className="brand-select">
            Бренд
            <select aria-label="Фильтр по бренду" value={brand} onChange={(event) => dispatchFilters({ type: 'setBrand', value: event.target.value })}>
              <option value={ALL_BRANDS}>Все бренды</option>
              {productBrands.map((name) => <option key={name}>{name}</option>)}
            </select>
            <Icon name="chevron" size={14} />
          </label>
          <label className="price-filter">
            До {formatPriceCents(maxPriceCents)}
            <input
              type="range"
              min={Math.max(0, Math.floor(MIN_PRICE_CENTS / 100) * 100)}
              max={MAX_PRICE_CENTS}
              step="100"
              value={maxPriceCents}
              onChange={(event) => dispatchFilters({ type: 'setMaxPrice', value: Number(event.target.value) })}
              aria-label="Максимальная цена"
            />
          </label>
          <label className="stock-filter">
            <input type="checkbox" checked={inStockOnly} onChange={() => dispatchFilters({ type: 'toggleInStock' })} />
            <span className="custom-check"><Icon name="check" size={12} /></span> В наличии
          </label>
          <button className="reset-filters" type="button" onClick={onResetFilters}>Сбросить</button>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img src={getImageUrl(product.image, 640)} alt={product.title} loading="lazy" />
                <span className={`product-badge ${product.badge === BADGES.NEW ? 'badge-new' : ''}`}>{product.badge}</span>
                <button
                  className={`product-favorite ${favorites.includes(product.id) ? 'is-active' : ''}`}
                  type="button"
                  aria-label={favorites.includes(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
                  onClick={() => onToggleFavorite(product.id)}
                >
                  <Icon name="heart" size={19} />
                </button>
              </div>
              <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3>{product.title}</h3>
                <div className="product-rating">
                  <Icon name="star" size={14} />
                  <strong>{product.rating}</strong>
                  <span>({product.reviews})</span>
                  <span className={`stock-label ${!product.inStock ? 'stock-order' : ''}`}><i />{product.inStock ? 'В наличии' : 'Под заказ'}</span>
                </div>
                <div className="product-purchase">
                  <div className="product-price">
                    <strong>{formatPriceCents(product.priceCents)}</strong>
                    <del>{formatPriceCents(product.oldPriceCents)}</del>
                  </div>
                  <button
                    className={`add-cart ${cart[product.id] ? 'added' : ''}`}
                    type="button"
                    aria-label={`Добавить в корзину: ${product.title}`}
                    onClick={() => onAddToCart(product.id)}
                  >
                    {cart[product.id]
                      ? <><Icon name="check" size={17} /><span>{cart[product.id]}</span></>
                      : <Icon name="cart" size={18} />}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="empty-results">
            <Icon name="search" size={28} />
            <strong>{showFavorites ? 'В избранном пока пусто' : 'Ничего не нашлось'}</strong>
            <span>{showFavorites ? 'Нажимайте на сердечко у товара, чтобы сохранить его здесь.' : 'Попробуйте изменить условия поиска или фильтры.'}</span>
            <button type="button" onClick={onResetFilters}>{showFavorites ? 'Перейти в каталог' : 'Сбросить фильтры'}</button>
          </div>
        )}
        <div className="catalog-footer">
          <span>Показано {pluralizeProducts(filteredProducts.length)} из {pluralizeProducts(products.length)}</span>
          <button className="button button-outline" type="button" onClick={onResetFilters}>Смотреть весь каталог <Icon name="arrow" size={17} /></button>
        </div>
      </div>
    </section>
  )
}
