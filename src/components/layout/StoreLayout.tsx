import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { CartDrawer } from '../cart/CartDrawer.tsx'
import { CheckoutModal } from '../checkout/CheckoutModal.tsx'
import { Footer } from './Footer.tsx'
import { StoreHeader } from './StoreHeader.tsx'
import { categories } from '../../data/categories.ts'
import { useStore } from '../../app/useStore.ts'

export function StoreLayout() {
  const navigate = useNavigate()
  const {
    cart,
    cartCount,
    cartProducts,
    cartTotalCents,
    changeQuantity,
    clearCart,
    currentUser,
    demoData,
    dispatchFilters,
    favorites,
    filters,
    setDemoData,
  } = useStore()
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  function chooseCategory(categoryId: string) {
    dispatchFilters({ type: 'setCategory', value: categoryId })
    setCategoriesOpen(false)
    navigate('/catalog')
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
        onChooseCategory={chooseCategory}
        onOpenAccount={() => navigate('/account')}
        onOpenCart={() => setCartOpen(true)}
        onSearchChange={(value) => {
          dispatchFilters({ type: 'setSearch', value })
          navigate('/catalog')
        }}
        onToggleCategories={() => setCategoriesOpen((open) => !open)}
        onToggleFavorites={() => {
          dispatchFilters({ type: 'toggleFavorites' })
          navigate('/catalog')
        }}
        search={filters.search}
        showFavorites={filters.showFavorites}
      />
      <main>
        <Outlet />
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
      <CheckoutModal
        cart={cart}
        cartCount={cartCount}
        cartTotalCents={cartTotalCents}
        currentUser={currentUser}
        demoData={demoData}
        isOpen={checkoutOpen}
        onCartClear={clearCart}
        onClose={() => setCheckoutOpen(false)}
        onDemoDataChange={setDemoData}
        products={cartProducts}
      />
    </div>
  )
}
