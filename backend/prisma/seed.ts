import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
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

const products = [
  { sku: 'SB-001', title: 'Штукатурка гипсовая, 30 кг', categoryId: 'dry-mixes', brand: 'СТАРАТЕЛИ', priceCents: 1890, oldPriceCents: 2240, rating: 4.9, reviews: 128, image: 'photo-1581092160562-40aa08e78837', badge: 'Хит продаж', stock: 50 },
  { sku: 'SB-002', title: 'Кирпич керамический полнотелый', categoryId: 'bricks-blocks', brand: 'КЕРАМИН', priceCents: 148, oldPriceCents: 172, rating: 4.8, reviews: 86, image: 'photo-1504307651254-35680f356dfd', badge: 'Выгодная цена', stock: 50 },
  { sku: 'SB-003', title: 'Утеплитель минеральный, 50 мм', categoryId: 'insulation', brand: 'ISOVER', priceCents: 3460, oldPriceCents: 3990, rating: 4.9, reviews: 64, image: 'photo-1621905251918-48416bd8575a', badge: 'Хит продаж', stock: 50 },
  { sku: 'SB-004', title: 'Доска обрезная 25 × 150 × 6000', categoryId: 'lumber', brand: 'ЛЕСНОЙ ДОМ', priceCents: 1280, oldPriceCents: 1550, rating: 4.7, reviews: 42, image: 'photo-1600607687939-ce8a6c25118c', badge: 'Новинка', stock: 50 },
  { sku: 'SB-005', title: 'Краска интерьерная белая, 9 л', categoryId: 'paint', brand: 'TIKKURILA', priceCents: 6850, oldPriceCents: 7900, rating: 4.9, reviews: 173, image: 'photo-1562259949-e8e7689d7828', badge: 'Новинка', stock: 50 },
  { sku: 'SB-006', title: 'Керамогранит «Бетон», 60 × 60 см', categoryId: 'tiles', brand: 'КЕРАМИН', priceCents: 4200, oldPriceCents: 4950, rating: 4.8, reviews: 57, image: 'photo-1600607687920-4e2a09cf159d', badge: 'Хит продаж', stock: 50 },
  { sku: 'SB-007', title: 'Шуруповёрт аккумуляторный, 18 В', categoryId: 'tools', brand: 'DEWALT', priceCents: 28900, oldPriceCents: 32900, rating: 5, reviews: 39, image: 'photo-1504148455328-c376907d081c', badge: 'Новинка', stock: 50 },
  { sku: 'SB-008', title: 'Металлочерепица, модульная', categoryId: 'roofing', brand: 'GRAND LINE', priceCents: 3170, oldPriceCents: 3600, rating: 4.8, reviews: 91, image: 'photo-1635424710928-ff6d33f8ac8b', badge: 'Хит продаж', stock: 0 },
]

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    })
  }

  for (const product of products) {
    const { stock, ...productDetails } = product
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: productDetails,
      create: { ...productDetails, stock },
    })
  }
}

main()
  .catch((error: unknown) => {
    console.error('Failed to seed the database:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
