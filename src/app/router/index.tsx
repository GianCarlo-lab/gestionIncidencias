import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@app/layouts/MainLayout'
import { ROUTES } from '@constants/index'

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        // Placeholder: se reemplazara con el Guard de autenticacion en Fase 3
        element: (
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-muted-foreground">Pide Servicio — Fase 1 lista</p>
          </div>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
