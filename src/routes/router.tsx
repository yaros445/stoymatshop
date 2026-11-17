import { createBrowserRouter, Navigate } from 'react-router-dom'
import { StoreLayout } from '../components/layout/StoreLayout.tsx'
import { RouteErrorPage } from '../pages/RouteErrorPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: StoreLayout,
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <div className="container route-loading" role="status">Загружаем страницу…</div>,
    children: [
      { index: true, element: <Navigate to="/catalog" replace /> },
      {
        path: 'catalog',
        lazy: async () => {
          const { CatalogPage } = await import('../pages/CatalogPage.tsx')
          return { Component: CatalogPage }
        },
      },
      {
        path: 'calculator',
        lazy: async () => {
          const { CalculatorPage } = await import('../pages/CalculatorPage.tsx')
          return { Component: CalculatorPage }
        },
      },
      {
        path: 'about',
        lazy: async () => {
          const { AboutPage } = await import('../pages/AboutPage.tsx')
          return { Component: AboutPage }
        },
      },
      {
        path: 'reviews',
        lazy: async () => {
          const { ReviewsPage } = await import('../pages/ReviewsPage.tsx')
          return { Component: ReviewsPage }
        },
      },
      {
        path: 'delivery',
        lazy: async () => {
          const { DeliveryPage } = await import('../pages/DeliveryPage.tsx')
          return { Component: DeliveryPage }
        },
      },
      {
        path: 'account',
        lazy: async () => {
          const { AccountPage } = await import('../pages/AccountPage.tsx')
          return { Component: AccountPage }
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('../pages/NotFoundPage.tsx')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
