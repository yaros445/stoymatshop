import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_CATEGORIES, ALL_BRANDS, TABS } from '../constants/filters.ts'
import { categories, getProductCountByCategory } from '../data/categories.ts'
import { products as catalogProducts } from '../data/products.ts'
import { calculatePlaster, filterProducts } from './storefront.ts'
import { formatPrice, formatPriceCents } from './formatPrice.ts'
import { getImageUrl } from './image.ts'
import { sumCartTotalCents } from './money.ts'
import { pluralizeProducts } from './pluralize.ts'

const products = [
  { id: 1, title: 'Штукатурка', categoryId: 'dry-mixes', brand: 'A', sku: 'A-1', priceCents: 1890, badge: 'Хит продаж', inStock: true },
  { id: 2, title: 'Краска', categoryId: 'paint', brand: 'B', sku: 'B-2', priceCents: 6850, badge: 'Новинка', inStock: false },
]

const filters = {
  search: '',
  category: ALL_CATEGORIES,
  tab: TABS.ALL,
  brand: ALL_BRANDS,
  maxPriceCents: 10000,
  inStockOnly: false,
  showFavorites: false,
  favorites: [],
}

test('filters by stock, sales tab, and SKU search', () => {
  assert.deepEqual(filterProducts(products, { ...filters, inStockOnly: true }).map(({ id }) => id), [1])
  assert.deepEqual(filterProducts(products, { ...filters, tab: TABS.BESTSELLERS }).map(({ id }) => id), [1])
  assert.deepEqual(filterProducts(products, { ...filters, search: 'B-2' }).map(({ id }) => id), [2])
})

test('applies visible filters to favorites', () => {
  assert.deepEqual(
    filterProducts(products, { ...filters, showFavorites: true, favorites: [1, 2], inStockOnly: true })
      .map(({ id }) => id),
    [1],
  )
})

test('search uses the category names loaded from the API', () => {
  const apiCategories = categories.map((category) => category.id === 'dry-mixes'
    ? { ...category, title: 'Отделочные смеси' }
    : category)

  assert.deepEqual(
    filterProducts(products, { ...filters, search: 'отделочные смеси' }, apiCategories).map(({ id }) => id),
    [1],
  )
})

test('calculates plaster with non-negative dimensions and reserve', () => {
  assert.deepEqual(calculatePlaster(-6, -2.7), { area: 0, bags: 0 })
  const result = calculatePlaster(6, 2.7)
  assert.ok(Math.abs(result.area - 16.2) < Number.EPSILON * 100)
  assert.equal(result.bags, 6)
})

test('sums cart totals as integer cents', () => {
  assert.equal(sumCartTotalCents(products, { 1: 3, 2: 2 }), 19370)
})

test('formats prices and Russian product forms consistently', () => {
  assert.equal(formatPriceCents(148), formatPrice(1.48))
  assert.equal(pluralizeProducts(1), '1 товар')
  assert.equal(pluralizeProducts(2), '2 товара')
  assert.equal(pluralizeProducts(5), '5 товаров')
  assert.equal(pluralizeProducts(21), '21 товар')
})

test('catalog records have unique SKUs, valid category IDs, and integer-cent prices', () => {
  const categoryIds = new Set(categories.map((category) => category.id))
  const skus = catalogProducts.map((product) => product.sku)

  assert.equal(new Set(skus).size, skus.length)
  for (const product of catalogProducts) {
    assert.ok(categoryIds.has(product.categoryId))
    assert.ok(Number.isInteger(product.priceCents))
    assert.ok(Number.isInteger(product.oldPriceCents))
  }
  assert.equal(getProductCountByCategory(catalogProducts, 'dry-mixes'), 1)
})

test('builds a consistent image URL for each image size', () => {
  assert.equal(
    getImageUrl('photo-id', 640),
    'https://images.unsplash.com/photo-id?auto=format&fit=crop&w=640&q=80',
  )
})
