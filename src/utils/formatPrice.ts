const priceFormatter = new Intl.NumberFormat('ru-BY', {
  style: 'currency',
  currency: 'BYN',
})

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount)
}

export function formatPriceCents(priceCents: number): string {
  return formatPrice(priceCents / 100)
}
