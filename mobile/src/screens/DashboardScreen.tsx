import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import client from '../api/client'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { MainTabParamList } from '../../App'

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>

export default function DashboardScreen({ }: Props) {
  const navigation = useNavigation<any>()
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/reports/dashboard/')
      .then(({ data }: { data: any }) => setSummary(data))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1d4ed8" />
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <StatCard title="Usuarios" value={summary?.users?.total} sub="registrados" color="#dbeafe" />
        <StatCard title="Cuentas activas" value={summary?.services?.active_accounts} sub="servicios" color="#dcfce7" />
        <StatCard title="Facturas pendientes" value={summary?.invoices?.pending} sub="por cobrar" color="#fef9c3" />
        <StatCard title="Cobrado este mes" value={`$${summary?.payments?.total_this_month ?? 0}`} sub="MXN" color="#f3e8ff" />
      </View>

    </ScrollView>
  )
}

function StatCard({ title, value, sub, color }: {
  title: string
  value: any
  sub: string
  color: string
}) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    paddingTop: 56,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logout: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: '47%',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardSub: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
})
