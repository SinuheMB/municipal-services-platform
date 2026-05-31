import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import client from '../api/client'
import type { RootStackParamList } from '../../App'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { MainTabParamList } from '../../App'


type Props = BottomTabScreenProps<MainTabParamList, 'Invoices'>

const statusColors: Record<string, string> = {
  pending: '#fef9c3',
  paid: '#dcfce7',
  overdue: '#fee2e2',
  cancelled: '#f3f4f6',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
}

export default function InvoicesScreen({ }: Props) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<any>()

  useEffect(() => {
    client.get('/billing/invoices/')
      .then(({ data }: { data: any[] }) => setInvoices(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1d4ed8" />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Facturas</Text>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.invoiceNumber}>{item.invoice_number}</Text>
              <View style={[styles.badge, { backgroundColor: statusColors[item.status] }]}>
                <Text style={styles.badgeText}>{statusLabels[item.status]}</Text>
              </View>
            </View>
            <Text style={styles.account}>Cuenta: {item.account_number}</Text>
            <Text style={styles.period}>Período: {item.period_start} / {item.period_end}</Text>
            <Text style={styles.total}>Total: ${item.total} MXN</Text>
            <Text style={styles.due}>Vence: {item.due_date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay facturas disponibles</Text>
        }
      />
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  back: {
    color: '#1d4ed8',
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceNumber: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1f2937',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  account: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  period: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  total: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 6,
  },
  due: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 15,
  },
})
