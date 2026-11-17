import { BenefitsSection } from '../components/marketing/BenefitsSection.tsx'
import { PageHeading } from '../components/layout/PageHeading.tsx'

export function AboutPage() {
  return (
    <>
      <PageHeading
        eyebrow="О КОМПАНИИ"
        title="СтройБаза — материалы для дела"
        description="Помогаем сделать строительство и ремонт предсказуемыми — от расчёта до доставки."
      />
      <BenefitsSection />
    </>
  )
}
