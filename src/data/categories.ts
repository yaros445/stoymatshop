import type { Category } from '../types.ts'

export const categories: Category[] = [
  { id: 'dry-mixes', title: 'Сухие смеси', icon: 'mix', count: '124 товара' },
  { id: 'bricks-blocks', title: 'Кирпич и блоки', icon: 'brick', count: '86 товаров' },
  { id: 'lumber', title: 'Пиломатериалы', icon: 'wood', count: '58 товаров' },
  { id: 'roofing', title: 'Кровля', icon: 'roof', count: '73 товара' },
  { id: 'insulation', title: 'Изоляция', icon: 'insulation', count: '91 товар' },
  { id: 'tiles', title: 'Плитка', icon: 'tile', count: '112 товаров' },
  { id: 'plumbing', title: 'Сантехника', icon: 'water', count: '64 товара' },
  { id: 'electrical', title: 'Электрика', icon: 'bolt', count: '105 товаров' },
  { id: 'tools', title: 'Инструмент', icon: 'tool', count: '148 товаров' },
  { id: 'fasteners', title: 'Крепёж', icon: 'fastener', count: '230 товаров' },
  { id: 'paint', title: 'Лакокрасочные материалы', icon: 'mix', count: '42 товара' },
]

export function getProductCountByCategory(products: Array<{ categoryId: string }>, categoryId: string): number {
  return products.filter((product) => product.categoryId === categoryId).length
}
