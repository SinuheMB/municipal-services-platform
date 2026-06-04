import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginScreen from './screens/LoginScreen'
import CajaScreen from './screens/CajaScreen'
import AdminScreen from './screens/AdminScreen'
import client from './api/client'

function RoleRedirect() {
  const [redirect, setRedirect] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setRedirect('/login')
      return
    }
    client.get('/users/profile/')
      .then(({ data }) => {
        setRedirect(data.role === 'admin' ? '/admin' : '/caja')
      })
      .catch(() => {
        localStorage.clear()
        setRedirect('/login')
      })
  }, [])

  if (!redirect) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-sm">Verificando sesión...</p>
    </div>
  )

  return <Navigate to={redirect} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/caja" element={<CajaScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
