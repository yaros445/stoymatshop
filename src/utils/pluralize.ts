const russianPluralRules = new Intl.PluralRules('ru')

interface PluralForms {
  one: string
  few: string
  many: string
  other?: string
}

export function pluralize(count: number, forms: PluralForms): string {
  const formsByRule: Record<Intl.LDMLPluralRule, string> = {
    one: forms.one,
    few: forms.few,
    many: forms.many,
    other: forms.other ?? forms.few,
    zero: forms.other ?? forms.few,
    two: forms.other ?? forms.few,
  }
  const form = formsByRule[russianPluralRules.select(count)]

  return `${count} ${form}`
}

export function pluralizeProducts(count: number): string {
  return pluralize(count, { one: 'товар', few: 'товара', many: 'товаров' })
}
