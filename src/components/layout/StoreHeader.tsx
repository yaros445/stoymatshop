import { Link, NavLink } from 'react-router-dom'
import { contacts } from '../../data/contacts.ts'
import { Icon } from '../ui/Icon.tsx'
import { Logo } from './Logo.tsx'
import type { Category } from '../../types.ts'

interface StoreHeaderProps {
  categories: Category[]
  categoriesOpen: boolean
  cartCount: number
  favoritesCount: number
  accountLabel: string
  accountAriaLabel: string
  onChooseCategory: (categoryId: string) => void
  onOpenAccount: () => void
  onOpenCart: () => void
  onSearchChange: (value: string) => void
  onToggleCategories: () => void
  onToggleFavorites: () => void
  search: string
  showFavorites: boolean
}

export function StoreHeader({
  categories,
  categoriesOpen,
  cartCount,
  favoritesCount,
  accountLabel,
  accountAriaLabel,
  onChooseCategory,
  onOpenAccount,
  onOpenCart,
  onSearchChange,
  onToggleCategories,
  onToggleFavorites,
  search,
  showFavorites,
}: StoreHeaderProps) {
  return (
    <>
      <div className="topline">
        <div className="container topline-inner">
          <span>Стройматериалы с заботой о вашем проекте</span>
          <div>
            <Link to="/delivery">Доставка и оплата</Link>
            <Link to="/delivery#contacts">Контакты</Link>
            <a className="mobile-phone" href={contacts.phoneHref}>{contacts.phone}</a>
            <span><Icon name="location" size={15} /> {contacts.city}</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Logo />
          <div className="search-box">
            <Icon name="search" size={19} />
            <input
              aria-label="Поиск по товарам"
              placeholder="Найти материалы, бренд или артикул"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </div>
          <a className="phone-block" href={contacts.phoneHref}>
            <Icon name="phone" size={18} />
            <span><strong>{contacts.phone}</strong><small>Ежедневно с 8:00 до 20:00</small></span>
          </a>
          <button className="icon-action account-action" type="button" aria-label={accountAriaLabel} onClick={onOpenAccount}>
            <Icon name="user" size={21} />
            <span>{accountLabel}</span>
          </button>
          <button
            className={`icon-action favorite-action ${showFavorites ? 'is-active' : ''}`}
            type="button"
            aria-label="Показать избранное"
            aria-pressed={showFavorites}
            onClick={onToggleFavorites}
          >
            <Icon name="heart" size={21} />
            <span>Избранное</span>
            {favoritesCount > 0 && <b>{favoritesCount}</b>}
          </button>
          <button className="cart-action" type="button" onClick={onOpenCart}>
            <Icon name="cart" size={19} />
            <span>Корзина</span>
            <b>{cartCount}</b>
          </button>
        </div>
        <div className="nav-row">
          <div className="container nav-inner">
            <button
              className={`catalog-menu ${categoriesOpen ? 'is-open' : ''}`}
              type="button"
              aria-expanded={categoriesOpen}
              onClick={onToggleCategories}
            >
              <Icon name="menu" size={19} /> Каталог товаров <Icon name="chevron" size={15} />
            </button>
            <nav className="main-nav" aria-label="Основная навигация">
              <NavLink to="/catalog">Каталог</NavLink>
              <NavLink to="/calculator">Калькулятор</NavLink>
              <NavLink to="/about">О компании</NavLink>
              <NavLink to="/reviews">Отзывы</NavLink>
            </nav>
            <span className="nav-promo"><span /> Доставка от 300 BYN — бесплатно</span>
          </div>
          {categoriesOpen && (
            <div className="category-dropdown">
              <div className="container category-dropdown-inner">
                {categories.map((category) => (
                  <button type="button" key={category.id} onClick={() => onChooseCategory(category.id)}>
                    <Icon name={category.icon} size={19} />
                    {category.title}
                    <Icon name="arrow" size={15} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
