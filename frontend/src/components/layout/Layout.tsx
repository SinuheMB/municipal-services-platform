import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

export default function Layout() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  )
}
