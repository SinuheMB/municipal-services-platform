import client from './client'
import type { AuthTokens, User } from '../types'

export const login = async (username: string, password: string): Promise<AuthTokens> => {
  const { data } = await client.post('/users/login/', { username, password })
  return data
}

export const register = async (userData: {
  username: string
  email: string
  password: string
  role: string
  phone: string
}): Promise<User> => {
  const { data } = await client.post('/users/register/', userData)
  return data
}

export const getProfile = async (): Promise<User> => {
  const { data } = await client.get('/users/profile/')
  return data
}

export const logout = async (refresh: string): Promise<void> => {
  await client.post('/users/logout/', { refresh })
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
