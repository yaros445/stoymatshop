import { useNavigate } from 'react-router-dom'
import { CalculatorSection } from '../components/calculator/CalculatorSection.tsx'
import { PageHeading } from '../components/layout/PageHeading.tsx'
import { useStore } from '../app/useStore.ts'

export function CalculatorPage() {
  const navigate = useNavigate()
  const { dispatchFilters } = useStore()

  function showCalculatedProducts() {
    dispatchFilters({ type: 'setSearch', value: 'штукатурка' })
    navigate('/catalog')
  }

  return (
    <>
      <PageHeading
        eyebrow="РАСЧЁТ МАТЕРИАЛОВ"
        title="Калькулятор штукатурки"
        description="Укажите размеры стены, чтобы рассчитать примерное количество штукатурной смеси."
      />
      <CalculatorSection onChooseMaterials={showCalculatedProducts} />
    </>
  )
}
