import { Outlet } from 'react-router-dom'

// Layout principal vacio. Se completara en la Fase 4 (Layout Base).
// Aqui se ubicaran: Header, Sidebar, Navbar movil y Footer.
export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
