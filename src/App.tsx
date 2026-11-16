import { useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AccountModal } from './components/account/AccountModal.tsx'
import { readDemoData } from './components/account/demoAccountStorage.ts'
import { CalculatorSection } from './components/calculator/CalculatorSection.tsx'
import { CartDrawer } from './components/cart/CartDrawer.tsx'
import { CatalogSection } from './components/catalog/CatalogSection.tsx'
import { CategorySection } from './components/catalog/CategorySection.tsx'
import { CheckoutModal } from './components/checkout/CheckoutModal.tsx'
import { Footer } from './components/layout/Footer.tsx'
import { StoreHeader } from './components/layout/StoreHeader.tsx'
import { BenefitsSection } from './components/marketing/BenefitsSection.tsx'
import { ReviewsSection } from './components/marketing/ReviewsSection.tsx'
import { categories } from './data/categories.ts'
import { products } from './data/products.ts'
import { useCatalogFilters } from './features/catalog/useCatalogFilters.ts'
import { filterProducts } from './utils/storefront.ts'
import { sumCartTotalCents } from './utils/money.ts'
import type { Cart, DemoData } from './types.ts'
import './App.css'

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="container section-space">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        <p className="heading-note">{description}</p>
      </div>
    </div>
  )
}

function DeliveryPage() {
  return (
    <>
      <PageIntro
        eyebrow="ПОКУПКА БЕЗ ЛИШНИХ ХЛОПОТ"
        title="Доставка и оплата"
        description="Доставляем стройматериалы по Минску и всей Беларуси. Менеджер подтвердит наличие, стоимость доставки и удобное время."
      />
      <section className="benefits-section section-space">
        <div className="container benefit-grid">
          <article>
            <h2>Доставка</h2>
            <p>По Минску — обычно на следующий день. Для регионов согласуем дату и стоимость при подтверждении заказа.</p>
          </article>
          <article>
            <h2>Стоимость</h2>
            <p>Доставка от 300 BYN по Минску бесплатна. Стоимость доставки за пределы города зависит от адреса и состава заказа.</p>
          </article>
          <article>
            <h2>Оплата</h2>
            <p>Наличными или картой при получении. Для юридических лиц доступен безналичный расчёт.</p>
          </article>
          <article id="contacts">
            <h2>Связаться с нами</h2>
            <p>Уточнить детали можно по телефону <a href="tel:+375173090909">+375 (17) 309-09-09</a> ежедневно с 8:00 до 20:00.</p>
          </article>
        </div>
      </section>
    </>
  )
}

function NotFoundPage() {
  return (
    <section className="container section-space">
      <div className="empty-results">
        <strong>Страница не найдена</strong>
        <span>Возможно, адрес изменился или страница была удалена.</span>
        <Link className="button button-primary" to="/catalog">Перейти в каталог</Link>
      </div>
    </section>
  )
}

function App() {
  const navigate = useNavigate()
  const { filters, dispatch, resetFilters } = useCatalogFilters()
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [demoData, setDemoData] = useState<DemoData>(readDemoData)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const currentUser = demoData.users.find((user) => user.id === demoData.currentUserId) ?? null
  const filteredProducts = useMemo(
    () => filterProducts(products, { ...filters, favorites }),
    [favorites, filters],
  )
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotalCents = sumCartTotalCents(products, cart)
  const cartProducts = useMemo(
    () => products.map((product) => ({ ...product, price: product.priceCents / 100 })),
    [],
  )

  function chooseCategory(categoryId: string) {
    dispatch({ type: 'setCategory', value: categoryId })
    navigate('/catalog')
  }

  function addToCart(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) => {
      const quantity = (current[id] ?? 0) + amount
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity }
    })
  }

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id])
  }

  return (
    <div className="storefront">
      <StoreHeader
        accountAriaLabel={currentUser ? 'Личный кабинет' : 'Войти'}
        accountLabel={currentUser ? 'Профиль' : 'Войти'}
        categories={categories}
        categoriesOpen={categoriesOpen}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        onChooseCategory={(categoryId) => {
          chooseCategory(categoryId)
          setCategoriesOpen(false)
        }}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onSearchChange={(value) => {
          dispatch({ type: 'setSearch', value })
          navigate('/catalog')
        }}
        onToggleCategories={() => setCategoriesOpen((open) => !open)}
        onToggleFavorites={() => {
          dispatch({ type: 'toggleFavorites' })
          navigate('/catalog')
        }}
        search={filters.search}
        showFavorites={filters.showFavorites}
      />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route
            path="/catalog"
            element={(
              <>
                <PageIntro
                  eyebrow="ВСЁ ДЛЯ СТРОИТЕЛЬСТВА И РЕМОНТА"
                  title="Каталог стройматериалов"
                  description="Выбирайте материалы по категориям, сравнивайте цены и оформляйте заказ онлайн."
                />
                <CategorySection
                  categories={categories}
                  onSelectCategory={chooseCategory}
                  onShowAll={resetFilters}
                />
                <CatalogSection
                  activeCategory={filters.category}
                  activeTab={filters.tab}
                  brand={filters.brand}
                  cart={cart}
                  dispatchFilters={dispatch}
                  favorites={favorites}
                  filteredProducts={filteredProducts}
                  inStockOnly={filters.inStockOnly}
                  maxPriceCents={filters.maxPriceCents}
                  onAddToCart={addToCart}
                  onResetFilters={resetFilters}
                  onToggleFavorite={toggleFavorite}
                  showFavorites={filters.showFavorites}
                />
              </>
            )}
          />
          <Route
            path="/calculator"
            element={(
              <>
                <PageIntro
                  eyebrow="РАСЧЁТ МАТЕРИАЛОВ"
                  title="Калькулятор штукатурки"
                  description="Укажите размеры стены, чтобы рассчитать примерное количество штукатурной смеси."
                />
                <CalculatorSection onChooseMaterials={() => {
                  dispatch({ type: 'setSearch', value: 'штукатурка' })
                  navigate('/catalog')
                }} />
              </>
            )}
          />
          <Route path="/about" element={<><PageIntro eyebrow="О КОМПАНИИ" title="СтройБаза — материалы для дела" description="Помогаем сделать строительство и ремонт предсказуемыми — от расчёта до доставки." /><BenefitsSection /></>} />
          <Route path="/reviews" element={<><PageIntro eyebrow="ОТЗЫВЫ ПОКУПАТЕЛЕЙ" title="Слова тех, кто строит" description="Опыт частных покупателей, бригад и постоянных клиентов." /><ReviewsSection /></>} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotalCents / 100}
        isOpen={cartOpen}
        products={cartProducts}
        onChangeQuantity={changeQuantity}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
        onClose={() => setCartOpen(false)}
      />
      {accountOpen && (
        <AccountModal
          demoData={demoData}
          initialMode={currentUser ? 'profile' : 'login'}
          isOpen={accountOpen}
          onClose={() => setAccountOpen(false)}
          onDemoDataChange={setDemoData}
        />
      )}
      <CheckoutModal
        cart={cart}
        cartCount={cartCount}
        cartTotalCents={cartTotalCents}
        currentUser={currentUser}
        demoData={demoData}
        isOpen={checkoutOpen}
        onCartClear={() => setCart({})}
        onClose={() => setCheckoutOpen(false)}
        onDemoDataChange={setDemoData}
        products={cartProducts}
      />
    </div>
  )
}

export default App
