import { ALL_BRANDS, ALL_CATEGORIES, BADGES, TABS } from '../constants/filters.ts'
import { BAG_WEIGHT_KG, PLASTER_CONSUMPTION_KG_M2, RESERVE_RATIO } from '../constants/calculator.ts'
import { categories } from '../data/categories.ts'
import type { Product, CatalogFilters } from '../types.ts'

type FilterableProduct = Pick<Product, 'id' | 'title' | 'categoryId' | 'brand' | 'sku' | 'priceCents' | 'badge' | 'inStock'>

export function filterProducts<T extends FilterableProduct>(
  productsToFilter: T[],
  filters: CatalogFilters & { favorites: number[] },
): T[] {
  const search = filters.search.trim().toLocaleLowerCase('ru')

  return productsToFilter.filter((product) => {
    const categoryTitle = categories.find((category) => category.id === product.categoryId)?.title ?? ''
    const matchesSearch = `${product.title} ${categoryTitle} ${product.brand} ${product.sku}`
      .toLocaleLowerCase('ru')
      .includes(search)
    const matchesCategory = filters.category === ALL_CATEGORIES || product.categoryId === filters.category
    const matchesBrand = filters.brand === ALL_BRANDS || product.brand === filters.brand
    const matchesPrice = product.priceCents <= filters.maxPriceCents
    const matchesStock = !filters.inStockOnly || product.inStock
    const matchesTab = filters.tab === TABS.ALL ||
      (filters.tab === TABS.NEW ? product.badge === BADGES.NEW : product.badge === BADGES.BESTSELLER)
    const matchesFavorite = !filters.showFavorites || filters.favorites.includes(product.id)

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice &&
      matchesStock && matchesTab && matchesFavorite
  })
}

export function calculatePlaster(width: number, height: number) {
  const area = Math.max(0, Number(width) || 0) * Math.max(0, Number(height) || 0)
  const bags = Math.ceil(area * PLASTER_CONSUMPTION_KG_M2 * RESERVE_RATIO / BAG_WEIGHT_KG)

  return { area, bags }
}
