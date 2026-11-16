export const categories = [
  { id: 'dry-mixes', title: 'Сухие смеси', icon: 'mix' },
  { id: 'bricks-blocks', title: 'Кирпич и блоки', icon: 'brick' },
  { id: 'lumber', title: 'Пиломатериалы', icon: 'wood' },
  { id: 'roofing', title: 'Кровля', icon: 'roof' },
  { id: 'insulation', title: 'Изоляция', icon: 'insulation' },
  { id: 'tiles', title: 'Плитка', icon: 'tile' },
  { id: 'plumbing', title: 'Сантехника', icon: 'water' },
  { id: 'electrical', title: 'Электрика', icon: 'bolt' },
  { id: 'tools', title: 'Инструмент', icon: 'tool' },
  { id: 'fasteners', title: 'Крепёж', icon: 'fastener' },
  { id: 'paint', title: 'Лакокрасочные материалы', icon: 'mix' },
]

export function getProductCountByCategory(products, categoryId) {
  return products.filter((product) => product.categoryId === categoryId).length
}
