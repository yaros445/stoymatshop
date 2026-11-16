export function sumCartTotalCents(products, cart) {
  return products.reduce(
    (totalCents, product) => totalCents + product.priceCents * (cart[product.id] || 0),
    0,
  )
}
