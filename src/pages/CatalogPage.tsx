import { CatalogSection } from '../components/catalog/CatalogSection.tsx'
import { CategorySection } from '../components/catalog/CategorySection.tsx'
import { PageHeading } from '../components/layout/PageHeading.tsx'
import { useStore } from '../app/useStore.ts'

export function CatalogPage() {
  const {
    addToCart,
    cart,
    categories,
    catalogError,
    catalogStatus,
    dispatchFilters,
    favorites,
    filteredProducts,
    filters,
    maxProductPriceCents,
    minProductPriceCents,
    productBrands,
    resetFilters,
    products,
    toggleFavorite,
  } = useStore()

  return (
    <>
      <PageHeading
        eyebrow="ВСЁ ДЛЯ СТРОИТЕЛЬСТВА И РЕМОНТА"
        title="Каталог стройматериалов"
        description="Выбирайте материалы по категориям, сравнивайте цены и оформляйте заказ онлайн."
      />
      <CategorySection
        categories={categories}
        onSelectCategory={(categoryId) => dispatchFilters({ type: 'setCategory', value: categoryId })}
        onShowAll={resetFilters}
      />
      {catalogStatus === 'loading' && <p className="container api-status" role="status">Загружаем каталог с сервера…</p>}
      {catalogStatus === 'error' && <p className="container api-status api-error" role="alert">{catalogError}</p>}
      <CatalogSection
        activeCategory={filters.category}
        activeTab={filters.tab}
        brand={filters.brand}
        cart={cart}
        categories={categories}
        dispatchFilters={dispatchFilters}
        favorites={favorites}
        filteredProducts={filteredProducts}
        inStockOnly={filters.inStockOnly}
        maxProductPriceCents={maxProductPriceCents}
        maxPriceCents={filters.maxPriceCents}
        minProductPriceCents={minProductPriceCents}
        productBrands={productBrands}
        totalProducts={products.length}
        onAddToCart={addToCart}
        onResetFilters={resetFilters}
        onToggleFavorite={toggleFavorite}
        showFavorites={filters.showFavorites}
      />
    </>
  )
}
