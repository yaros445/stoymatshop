const priceFormatter = new Intl.NumberFormat('ru-BY', {
  style: 'currency',
  currency: 'BYN',
})

export function formatPrice(amount) {
  return priceFormatter.format(amount)
}

export function formatPriceCents(priceCents) {
  return formatPrice(priceCents / 100)
}
