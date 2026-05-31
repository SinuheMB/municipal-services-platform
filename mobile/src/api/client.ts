import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ─── ÚNICA FUENTE DE VERDAD ───────────────────────────────────────────────
// Cambia solo esta línea cuando cambies de red
export const API_URL = 'http://192.168.1.15:8000/api'

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client