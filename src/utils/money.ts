export function sumCartTotalCents(
  products: Array<{ id: number; priceCents: number }>,
  cart: Record<number, number>,
): number {
  return products.reduce(
    (totalCents, product) => totalCents + product.priceCents * (cart[product.id] || 0),
    0,
  )
}
