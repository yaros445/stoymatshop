import { CatalogSection } from '../components/catalog/CatalogSection.tsx'
import { CategorySection } from '../components/catalog/CategorySection.tsx'
import { PageHeading } from '../components/layout/PageHeading.tsx'
import { categories } from '../data/categories.ts'
import { useStore } from '../app/useStore.ts'

export function CatalogPage() {
  const {
    addToCart,
    cart,
    dispatchFilters,
    favorites,
    filteredProducts,
    filters,
    resetFilters,
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
      <CatalogSection
        activeCategory={filters.category}
        activeTab={filters.tab}
        brand={filters.brand}
        cart={cart}
        dispatchFilters={dispatchFilters}
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
  )
}
