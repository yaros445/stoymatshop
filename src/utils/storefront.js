import { ALL_BRANDS, ALL_CATEGORIES, BADGES, TABS } from '../constants/filters.js'
import { BAG_WEIGHT_KG, PLASTER_CONSUMPTION_KG_M2, RESERVE_RATIO } from '../constants/calculator.js'
import { categories } from '../data/categories.js'

export function filterProducts(products, filters) {
  const search = filters.search.trim().toLocaleLowerCase('ru')

  return products.filter((product) => {
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

export function calculatePlaster(width, height) {
  const area = Math.max(0, Number(width) || 0) * Math.max(0, Number(height) || 0)
  const bags = Math.ceil(area * PLASTER_CONSUMPTION_KG_M2 * RESERVE_RATIO / BAG_WEIGHT_KG)

  return { area, bags }
}
