import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import client from '../api/client'
import type { MainTabParamList } from '../../App'

type Props = BottomTabScreenProps<MainTabParamList, 'Summary'>

export default function SummaryScreen({ }: Props) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<any>()

  useEffect(() => {
    client.get('/billing/summary/')
      .then(({ data }) => setSummary(data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    navigation.replace('Login')
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1d4ed8" />
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Cuenta</Text>
      </View>

      {summary ? (
        <View style={styles.cards}>
          <View style={[styles.card, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.cardLabel}>Total facturas</Text>
            <Text style={styles.cardValue}>{summary.total_invoices}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#fef9c3' }]}>
            <Text style={styles.cardLabel}>Pendientes</Text>
            <Text style={styles.cardValue}>{summary.pending_count}</Text>
            <Text style={styles.cardSub}>${summary.pending_amount} MXN</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#fee2e2' }]}>
            <Text style={styles.cardLabel}>Vencidas</Text>
            <Text style={styles.cardValue}>{summary.overdue_count}</Text>
            <Text style={styles.cardSub}>${summary.overdue_amount} MXN</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No hay información de cuenta disponible</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 56,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cards: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardSub: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutButton: {
    margin: 16,
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 15,
  },
})
