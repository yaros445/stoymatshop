import { useEffect, useState } from 'react'
import { fetchAccountOrders } from '../../api/client.ts'
import { formatPriceCents } from '../../utils/formatPrice.ts'
import { Icon } from '../ui/Icon.tsx'
import type { FormEvent } from 'react'
import type { AccountMode } from '../../types.ts'
import type { ApiOrder, ApiUser } from '../../api/client.ts'

interface AccountModalProps {
  authLoadError: string
  authLoading: boolean
  currentUser: ApiUser | null
  initialMode: AccountMode
  isOpen: boolean
  presentation?: 'modal' | 'page'
  onClose: () => void
  onSignIn: (email: string, password: string) => Promise<void>
  onSignOut: () => Promise<void>
  onSignUp: (name: string, email: string, password: string) => Promise<void>
}

const orderStatusLabels: Record<string, string> = {
  PENDING: 'Ожидает подтверждения',
  CONFIRMED: 'Подтверждён',
  PROCESSING: 'Собирается',
  SHIPPED: 'Передан в доставку',
  COMPLETED: 'Выполнен',
  CANCELLED: 'Отменён',
}

export function AccountModal({
  authLoadError,
  authLoading,
  currentUser,
  initialMode,
  isOpen,
  presentation = 'modal',
  onClose,
  onSignIn,
  onSignOut,
  onSignUp,
}: AccountModalProps) {
  const [mode, setMode] = useState(initialMode)
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [accountOrders, setAccountOrders] = useState<{
    userId: string
    orders: ApiOrder[]
    error: string
  } | null>(null)

  useEffect(() => {
    const userId = currentUser?.id
    if (!userId) return

    let active = true
    fetchAccountOrders()
      .then((accountOrders) => {
        if (active) setAccountOrders({ userId, orders: accountOrders, error: '' })
      })
      .catch((error: unknown) => {
        if (active) {
          setAccountOrders({
            userId,
            orders: [],
            error: error instanceof Error ? error.message : 'Не удалось загрузить заказы.',
          })
        }
      })

    return () => { active = false }
  }, [currentUser?.id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError('')
    setAuthBusy(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email')).trim()
    const password = String(formData.get('password'))

    try {
      if (mode === 'register') {
        await onSignUp(String(formData.get('name')).trim(), email, password)
      } else {
        await onSignIn(email, password)
      }
      setMode('profile')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Не удалось выполнить запрос. Попробуйте ещё раз.')
    } finally {
      setAuthBusy(false)
    }
  }

  async function signOut() {
    setAuthBusy(true)
    setAuthError('')
    try {
      await onSignOut()
      setMode('login')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Не удалось завершить сеанс.')
    } finally {
      setAuthBusy(false)
    }
  }

  function switchMode() {
    setMode((currentMode) => currentMode === 'register' ? 'login' : 'register')
    setAuthError('')
  }

  const activeMode = currentUser ? 'profile' : mode
  const currentOrders = accountOrders && accountOrders.userId === currentUser?.id ? accountOrders : null
  const orders = currentOrders?.orders ?? []
  const ordersError = currentOrders?.error ?? ''
  const ordersLoading = Boolean(currentUser) && !currentOrders

  const panel = (
    <section className={`account-modal${presentation === 'page' ? ' account-page-panel' : ''}`} aria-label="Личный кабинет">
      <button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={onClose}>
        <Icon name="close" size={21} />
      </button>
      <span className="modal-icon"><Icon name="user" size={23} /></span>
      <span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>
      {currentUser && activeMode === 'profile' ? (
        <>
          <h2>Здравствуйте, {currentUser.name}</h2>
          <p>{currentUser.email}</p>
          <div className="profile-orders">
            <strong>История заказов ({orders.length})</strong>
            {ordersLoading && <p role="status">Загружаем заказы…</p>}
            {ordersError && <p className="form-error" role="alert">{ordersError}</p>}
            {!ordersLoading && !ordersError && orders.length === 0 && (
              <p>Пока заказов нет. Оформленные заказы появятся здесь.</p>
            )}
            {orders.map((order) => (
              <article key={order.id}>
                <div className="profile-order-heading">
                  <strong>Заказ {order.orderNumber}</strong>
                  <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</time>
                </div>
                <div className="profile-order-total">
                  <span>{orderStatusLabels[order.status] ?? order.status}</span>
                  <b>{formatPriceCents(order.totalCents)}</b>
                </div>
                <small>{order.items.map((item) => `${item.title} × ${item.quantity}`).join(', ')}</small>
                <small>{order.paymentMethod} · {order.address}</small>
              </article>
            ))}
          </div>
          {authError && <p className="form-error" role="alert">{authError}</p>}
          <button className="button button-outline profile-signout" type="button" onClick={signOut} disabled={authBusy}>
            {authBusy ? 'Выходим…' : 'Выйти из аккаунта'}
          </button>
        </>
      ) : (
        <>
          <h2>{mode === 'register' ? 'Создать аккаунт' : 'Рады вас видеть'}</h2>
          <p>{mode === 'register' ? 'Создайте аккаунт, чтобы сохранять историю заказов.' : 'Войдите, чтобы просматривать профиль и историю заказов.'}</p>
          {authLoading && <p role="status">Проверяем авторизацию…</p>}
          <form onSubmit={handleSubmit}>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            {mode === 'register' && <label>Имя<input name="name" type="text" autoComplete="name" minLength={2} maxLength={120} required /></label>}
            <label>
              Пароль
              <input
                name="password"
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                minLength={mode === 'register' ? 8 : 1}
                maxLength={128}
                required
              />
            </label>
            {(authError || authLoadError) && <p className="form-error" role="alert">{authError || authLoadError}</p>}
            <button className="button button-primary" type="submit" disabled={authBusy || authLoading}>
              {authBusy ? 'Подождите…' : mode === 'register' ? 'Зарегистрироваться' : 'Войти'} <Icon name="arrow" size={17} />
            </button>
          </form>
          <button className="text-link auth-switch" type="button" onClick={switchMode} disabled={authBusy}>
            {mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
          <small>Аккаунт и заказы сохраняются на сервере. Пароль хранится в виде криптографического хеша.</small>
        </>
      )}
    </section>
  )

  if (presentation === 'page') {
    return <div className="container account-page">{panel}</div>
  }
  if (!isOpen) return null

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      {panel}
    </div>
  )
}
