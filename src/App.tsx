import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './app/AppProviders.tsx'
import { StoreProvider } from './app/StoreProvider.tsx'
import { router } from './routes/router.tsx'
import './App.css'

export default function App() {
  return (
    <AppProviders>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AppProviders>
  )
}
