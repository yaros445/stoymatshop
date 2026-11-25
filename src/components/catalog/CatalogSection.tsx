import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import { ALL_BRANDS, ALL_CATEGORIES, BADGES, TABS } from '../../constants/filters.ts'
import { formatPriceCents } from '../../utils/formatPrice.ts'
import { getImageUrl } from '../../utils/image.ts'
import { pluralizeProducts } from '../../utils/pluralize.ts'
import { Icon } from '../ui/Icon.tsx'
import type { Cart, Category, Product } from '../../types.ts'
import type { CatalogFilterAction } from '../../features/catalog/useCatalogFilters.ts'
import type { Dispatch } from 'react'

interface CatalogSectionProps {
  activeCategory: string
  activeTab: string
  brand: string
  cart: Cart
  categories: Category[]
  dispatchFilters: Dispatch<CatalogFilterAction>
  favorites: number[]
  filteredProducts: Product[]
  inStockOnly: boolean
  maxProductPriceCents: number
  maxPriceCents: number
  minProductPriceCents: number
  productBrands: string[]
  totalProducts: number
  onAddToCart: (id: number) => void
  onResetFilters: () => void
  onToggleFavorite: (id: number) => void
  showFavorites: boolean
}

export function CatalogSection({
  activeCategory,
  activeTab,
  brand,
  cart,
  categories,
  dispatchFilters,
  favorites,
  filteredProducts,
  inStockOnly,
  maxProductPriceCents,
  maxPriceCents,
  minProductPriceCents,
  productBrands,
  totalProducts,
  onAddToCart,
  onResetFilters,
  onToggleFavorite,
  showFavorites,
}: CatalogSectionProps) {
  const sliderMin = Math.max(0, Math.floor(minProductPriceCents / 100) * 100)
  const sliderMax = Math.max(maxProductPriceCents, sliderMin + 100)

  return (
    <section className="products-section section-space" id="catalog">
      <div className="container">
        <div className="section-heading product-heading">
          <div>
            <span className="eyebrow">ТОЛЬКО ПРОВЕРЕННОЕ</span>
            <h2>{showFavorites ? 'Избранное' : activeCategory === ALL_CATEGORIES ? 'Выбор наших клиентов' : categories.find((category) => category.id === activeCategory)?.title ?? 'Каталог товаров'}</h2>
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
            <Slider
              min={sliderMin}
              max={sliderMax}
              step={100}
              value={maxPriceCents}
              onChange={(_, value) => dispatchFilters({ type: 'setMaxPrice', value: Number(value) })}
              aria-label="Максимальная цена"
              size="small"
              sx={{ width: 'clamp(62px, 7vw, 84px)', color: 'primary.main' }}
            />
          </label>
          <label className="stock-filter">
            <input type="checkbox" checked={inStockOnly} onChange={() => dispatchFilters({ type: 'toggleInStock' })} />
            <span className="custom-check"><Icon name="check" size={12} /></span> В наличии
          </label>
          <Button className="reset-filters" size="small" onClick={onResetFilters}>Сбросить</Button>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Card className="product-card" component="article" variant="outlined" key={product.id}>
              <div className="product-image-wrap">
                <img src={getImageUrl(product.image, 640)} alt={product.title} loading="lazy" />
                <Chip
                  className={`product-badge ${product.badge === BADGES.NEW ? 'badge-new' : ''}`}
                  label={product.badge}
                  size="small"
                  sx={{ position: 'absolute', top: 10, left: 10, borderRadius: 0, height: 24, fontSize: 10 }}
                />
                <IconButton
                  className={`product-favorite ${favorites.includes(product.id) ? 'is-active' : ''}`}
                  aria-label={favorites.includes(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
                  onClick={() => onToggleFavorite(product.id)}
                  sx={{ borderRadius: 0, p: 0 }}
                >
                  <Icon name="heart" size={19} />
                </IconButton>
              </div>
              <CardContent className="product-info" sx={{ p: '12px', '&:last-child': { pb: '12px' } }}>
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
                  <Button
                    className={`add-cart ${cart[product.id] ? 'added' : ''}`}
                    variant="contained"
                    color={cart[product.id] ? 'success' : 'primary'}
                    aria-label={`Добавить в корзину: ${product.title}`}
                    disableRipple
                    sx={{ minWidth: 35, p: 0, borderRadius: 0 }}
                    onClick={() => onAddToCart(product.id)}
                  >
                    {cart[product.id]
                      ? <><Icon name="check" size={17} /><span>{cart[product.id]}</span></>
                      : <Icon name="cart" size={18} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="empty-results">
            <Icon name="search" size={28} />
            <strong>{showFavorites ? 'В избранном пока пусто' : 'Ничего не нашлось'}</strong>
            <span>{showFavorites ? 'Нажимайте на сердечко у товара, чтобы сохранить его здесь.' : 'Попробуйте изменить условия поиска или фильтры.'}</span>
            <Button onClick={onResetFilters}>{showFavorites ? 'Перейти в каталог' : 'Сбросить фильтры'}</Button>
          </div>
        )}
        <div className="catalog-footer">
          <span>Показано {pluralizeProducts(filteredProducts.length)} из {pluralizeProducts(totalProducts)}</span>
          <Button className="button button-outline" variant="outlined" onClick={onResetFilters}>Смотреть весь каталог <Icon name="arrow" size={17} /></Button>
        </div>
      </div>
    </section>
  )
}
