import { useNavigate } from 'react-router-dom'
import { AccountModal } from '../components/account/AccountModal.tsx'
import { PageHeading } from '../components/layout/PageHeading.tsx'
import { useStore } from '../app/useStore.ts'

export function AccountPage() {
  const navigate = useNavigate()
  const { currentUser, demoData, setDemoData } = useStore()

  return (
    <>
      <PageHeading
        eyebrow="ВАШ ПРОФИЛЬ"
        title="Личный кабинет"
        description="Войдите или создайте аккаунт, чтобы сохранять историю оформленных заказов."
      />
      <AccountModal
        demoData={demoData}
        initialMode={currentUser ? 'profile' : 'login'}
        isOpen
        presentation="page"
        onClose={() => navigate('/catalog')}
        onDemoDataChange={setDemoData}
      />
    </>
  )
}
