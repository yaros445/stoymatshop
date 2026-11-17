import { useState } from 'react'
import { createId, hashPassword, saveDemoData } from './demoAccountStorage.ts'
import { formatPrice } from '../../utils/formatPrice.ts'
import { Icon } from '../ui/Icon.tsx'
import type { FormEvent } from 'react'
import type { AccountMode, DemoData } from '../../types.ts'

interface AccountModalProps {
  demoData: DemoData
  isOpen: boolean
  initialMode: AccountMode
  presentation?: 'modal' | 'page'
  onClose: () => void
  onDemoDataChange: (data: DemoData) => void
}

export function AccountModal({
  demoData,
  isOpen,
  initialMode,
  presentation = 'modal',
  onClose,
  onDemoDataChange,
}: AccountModalProps) {
  const [mode, setMode] = useState(initialMode)
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  const currentUser = demoData.users.find((user) => user.id === demoData.currentUserId) || null
  const userOrders = currentUser ? demoData.orders.filter((order) => order.userId === currentUser.id) : []

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError('')
    setAuthBusy(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email')).trim().toLowerCase()
    const password = String(formData.get('password'))

    try {
      let nextData
      if (mode === 'register') {
        const name = String(formData.get('name')).trim()
        if (demoData.users.some((user) => user.email === email)) {
          setAuthError('Аккаунт с таким email уже существует. Войдите в него.')
          return
        }

        const passwordSalt = createId()
        const passwordHash = await hashPassword(password, passwordSalt)
        const user = { id: createId(), name, email, passwordSalt, passwordHash }
        nextData = {
          ...demoData,
          users: [...demoData.users, user],
          currentUserId: user.id,
        }
      } else {
        const user = demoData.users.find((candidate) => candidate.email === email)
        if (!user || user.passwordHash !== await hashPassword(password, user.passwordSalt)) {
          setAuthError('Проверьте email и пароль.')
          return
        }
        nextData = { ...demoData, currentUserId: user.id }
      }

      saveDemoData(nextData)
      onDemoDataChange(nextData)
      setMode('profile')
      setAuthError('')
    } catch (error) {
      console.error('Не удалось выполнить вход или регистрацию:', error)
      setAuthError(error instanceof Error ? error.message : 'Не удалось сохранить данные. Попробуйте ещё раз.')
    } finally {
      setAuthBusy(false)
    }
  }

  function signOut() {
    try {
      const nextData = { ...demoData, currentUserId: null }
      saveDemoData(nextData)
      onDemoDataChange(nextData)
      setMode('login')
      setAuthError('')
    } catch (error) {
      console.error('Не удалось завершить сеанс:', error)
      setAuthError('Не удалось завершить сеанс. Попробуйте ещё раз.')
    }
  }

  function switchMode() {
    setMode((currentMode) => currentMode === 'register' ? 'login' : 'register')
    setAuthError('')
  }

  const panel = (
    <section className={`account-modal${presentation === 'page' ? ' account-page-panel' : ''}`} aria-label="Личный кабинет">
        <button className="close-button modal-close" type="button" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" size={21} />
        </button>
        <span className="modal-icon"><Icon name="user" size={23} /></span>
        <span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>
        {currentUser && mode === 'profile' ? (
          <>
            <h2>Здравствуйте, {currentUser.name}</h2>
            <p>{currentUser.email}</p>
            <div className="profile-orders">
              <strong>История заказов ({userOrders.length})</strong>
              {userOrders.length === 0 ? (
                <p>Пока заказов нет. Оформленные заказы появятся здесь.</p>
              ) : userOrders.map((order) => (
                <article key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <b>{formatPrice(order.total)}</b>
                  <small>{order.items.map((item) => `${item.title} × ${item.quantity}`).join(', ')}</small>
                  <small>Оплата при получении · {order.address}</small>
                </article>
              ))}
            </div>
            <button className="button button-outline profile-signout" type="button" onClick={signOut}>Выйти из аккаунта</button>
          </>
        ) : (
          <>
            <h2>{mode === 'register' ? 'Создать аккаунт' : 'Рады вас видеть'}</h2>
            <p>{mode === 'register' ? 'Зарегистрируйтесь, чтобы сохранять историю заказов в этом браузере.' : 'Войдите, чтобы видеть историю оформленных заказов.'}</p>
            <form onSubmit={handleSubmit}>
              <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              {mode === 'register' && <label>Имя<input name="name" type="text" autoComplete="name" minLength={2} required /></label>}
              <label>
                Пароль
                <input
                  name="password"
                  type="password"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  minLength={8}
                  required
                />
              </label>
              {authError && <p className="form-error" role="alert">{authError}</p>}
              <button className="button button-primary" type="submit" disabled={authBusy}>
                {authBusy ? 'Подождите…' : mode === 'register' ? 'Зарегистрироваться' : 'Войти'} <Icon name="arrow" size={17} />
              </button>
            </form>
            <button className="text-link auth-switch" type="button" onClick={switchMode}>
              {mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
            <small>Демо-режим: данные сохраняются только в этом браузере и не отправляются на сервер.</small>
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
