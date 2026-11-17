import { PageHeading } from '../components/layout/PageHeading.tsx'
import { ReviewsSection } from '../components/marketing/ReviewsSection.tsx'

export function ReviewsPage() {
  return (
    <>
      <PageHeading
        eyebrow="ОТЗЫВЫ ПОКУПАТЕЛЕЙ"
        title="Слова тех, кто строит"
        description="Опыт частных покупателей, бригад и постоянных клиентов."
      />
      <ReviewsSection />
    </>
  )
}
