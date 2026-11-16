import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_CATEGORIES, TABS } from '../../constants/filters.js'
import {
  catalogFiltersReducer,
  initialCatalogFilters,
} from './useCatalogFilters.js'

test('reset restores every filter to its initial value', () => {
  const activeFilters = {
    ...initialCatalogFilters,
    search: 'кирпич',
    category: 'bricks-blocks',
    tab: TABS.NEW,
    brand: 'КЕРАМИН',
    maxPriceCents: 5000,
    inStockOnly: true,
    showFavorites: true,
  }

  assert.deepEqual(catalogFiltersReducer(activeFilters, { type: 'reset' }), initialCatalogFilters)
})

test('search and category changes clear incompatible tab and favorites modes', () => {
  const favoritesFilters = {
    ...initialCatalogFilters,
    tab: TABS.NEW,
    showFavorites: true,
  }
  const afterSearch = catalogFiltersReducer(favoritesFilters, {
    type: 'setSearch',
    value: 'штукатурка',
  })

  assert.equal(afterSearch.search, 'штукатурка')
  assert.equal(afterSearch.tab, TABS.ALL)
  assert.equal(afterSearch.showFavorites, false)

  const afterCategory = catalogFiltersReducer(favoritesFilters, {
    type: 'setCategory',
    value: 'dry-mixes',
  })
  assert.equal(afterCategory.category, 'dry-mixes')
  assert.equal(afterCategory.showFavorites, false)
  assert.equal(afterCategory.tab, TABS.ALL)
})

test('favorites mode clears category and toggles without resetting other filters', () => {
  const filters = {
    ...initialCatalogFilters,
    category: 'dry-mixes',
    brand: 'СТАРАТЕЛИ',
    inStockOnly: true,
  }
  const favorites = catalogFiltersReducer(filters, { type: 'toggleFavorites' })

  assert.equal(favorites.category, ALL_CATEGORIES)
  assert.equal(favorites.showFavorites, true)
  assert.equal(favorites.brand, filters.brand)
  assert.equal(favorites.inStockOnly, true)
})
