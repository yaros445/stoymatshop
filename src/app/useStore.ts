import { useContext } from 'react'
import { StoreContext } from './storeContext.ts'

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore должен вызываться внутри StoreProvider.')
  }
  return context
}
