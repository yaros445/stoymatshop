import { useNavigate } from 'react-router-dom'
import { AccountModal } from '../components/account/AccountModal.tsx'
import { PageHeading } from '../components/layout/PageHeading.tsx'
import { useStore } from '../app/useStore.ts'

export function AccountPage() {
  const navigate = useNavigate()
  const { authLoadError, authLoading, currentUser, signIn, signOut, signUp } = useStore()

  return (
    <>
      <PageHeading
        eyebrow="ВАШ ПРОФИЛЬ"
        title="Личный кабинет"
        description="Входите в аккаунт, отслеживайте и просматривайте историю заказов."
      />
      <AccountModal
        authLoadError={authLoadError}
        authLoading={authLoading}
        currentUser={currentUser}
        initialMode={currentUser ? 'profile' : 'login'}
        isOpen
        presentation="page"
        onClose={() => navigate('/catalog')}
        onSignIn={signIn}
        onSignOut={signOut}
        onSignUp={signUp}
      />
    </>
  )
}
