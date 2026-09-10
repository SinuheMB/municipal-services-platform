import { useState, useEffect } from 'react'
import type { User } from '../types'
import { getProfile, logout as logoutApi } from '../api/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'))

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setIsAuthenticated(false)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token') || ''
    try {
      await logoutApi(refresh)
    } catch {
      // si el backend falla, igual limpiamos la sesión local
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const isAdmin = user?.role === 'admin'
  const isOperator = user?.role === 'operator' || user?.role === 'admin'

  return { user, loading, logout, isAuthenticated, isAdmin, isOperator }
}