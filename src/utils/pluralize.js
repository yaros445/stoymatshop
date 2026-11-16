const russianPluralRules = new Intl.PluralRules('ru')

export function pluralize(count, forms) {
  const form = {
    one: forms.one,
    few: forms.few,
    many: forms.many,
    other: forms.other ?? forms.few,
  }[russianPluralRules.select(count)]

  return `${count} ${form}`
}

export function pluralizeProducts(count) {
  return pluralize(count, { one: 'товар', few: 'товара', many: 'товаров' })
}
