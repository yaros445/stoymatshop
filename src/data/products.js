import { BADGES } from '../constants/filters.js'

export const products = [
  { id: 1, sku: 'SB-001', title: 'Штукатурка гипсовая, 30 кг', categoryId: 'dry-mixes', brand: 'СТАРАТЕЛИ', priceCents: 1890, oldPriceCents: 2240, rating: 4.9, reviews: 128, image: 'photo-1581092160562-40aa08e78837', badge: BADGES.BESTSELLER, inStock: true },
  { id: 2, sku: 'SB-002', title: 'Кирпич керамический полнотелый', categoryId: 'bricks-blocks', brand: 'КЕРАМИН', priceCents: 148, oldPriceCents: 172, rating: 4.8, reviews: 86, image: 'photo-1504307651254-35680f356dfd', badge: BADGES.VALUE, inStock: true },
  { id: 3, sku: 'SB-003', title: 'Утеплитель минеральный, 50 мм', categoryId: 'insulation', brand: 'ISOVER', priceCents: 3460, oldPriceCents: 3990, rating: 4.9, reviews: 64, image: 'photo-1621905251918-48416bd8575a', badge: BADGES.BESTSELLER, inStock: true },
  { id: 4, sku: 'SB-004', title: 'Доска обрезная 25 × 150 × 6000', categoryId: 'lumber', brand: 'ЛЕСНОЙ ДОМ', priceCents: 1280, oldPriceCents: 1550, rating: 4.7, reviews: 42, image: 'photo-1600607687939-ce8a6c25118c', badge: BADGES.NEW, inStock: true },
  { id: 5, sku: 'SB-005', title: 'Краска интерьерная белая, 9 л', categoryId: 'paint', brand: 'TIKKURILA', priceCents: 6850, oldPriceCents: 7900, rating: 4.9, reviews: 173, image: 'photo-1562259949-e8e7689d7828', badge: BADGES.NEW, inStock: true },
  { id: 6, sku: 'SB-006', title: 'Керамогранит «Бетон», 60 × 60 см', categoryId: 'tiles', brand: 'КЕРАМИН', priceCents: 4200, oldPriceCents: 4950, rating: 4.8, reviews: 57, image: 'photo-1600607687920-4e2a09cf159d', badge: BADGES.BESTSELLER, inStock: true },
  { id: 7, sku: 'SB-007', title: 'Шуруповёрт аккумуляторный, 18 В', categoryId: 'tools', brand: 'DEWALT', priceCents: 28900, oldPriceCents: 32900, rating: 5, reviews: 39, image: 'photo-1504148455328-c376907d081c', badge: BADGES.NEW, inStock: true },
  { id: 8, sku: 'SB-008', title: 'Металлочерепица, модульная', categoryId: 'roofing', brand: 'GRAND LINE', priceCents: 3170, oldPriceCents: 3600, rating: 4.8, reviews: 91, image: 'photo-1635424710928-ff6d33f8ac8b', badge: BADGES.BESTSELLER, inStock: false },
]

export const productBrands = [...new Set(products.map((product) => product.brand))]
export const MIN_PRICE_CENTS = Math.min(...products.map((product) => product.priceCents))
export const MAX_PRICE_CENTS = Math.max(...products.map((product) => product.priceCents))
