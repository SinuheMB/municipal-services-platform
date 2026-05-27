import { useEffect, useState } from 'react'
import type { DashboardSummary } from '../../types'
import { formatCurrency } from '../../utils'
import client from '../../api/client'

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/reports/dashboard/')
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )

  if (!summary) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Usuarios"
          value={summary.users.total}
          sub={`${summary.users.citizens} ciudadanos · ${summary.users.operators} operadores`}
          color="blue"
        />
        <StatCard
          title="Cuentas Activas"
          value={summary.services.active_accounts}
          sub={`${summary.services.suspended_accounts} suspendidas`}
          color="green"
        />
        <StatCard
          title="Facturas Pendientes"
          value={summary.invoices.pending}
          sub={formatCurrency(summary.invoices.pending_amount)}
          color="yellow"
        />
        <StatCard
          title="Cobrado este mes"
          value={formatCurrency(summary.payments.total_this_month)}
          sub={`${summary.payments.count_this_month} pagos`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InvoiceStatusCard
          label="Pagadas"
          count={summary.invoices.paid}
          color="green"
        />
        <InvoiceStatusCard
          label="Pendientes"
          count={summary.invoices.pending}
          color="yellow"
        />
        <InvoiceStatusCard
          label="Vencidas"
          count={summary.invoices.overdue}
          color="red"
        />
      </div>
    </div>
  )
}

function StatCard({
  title, value, sub, color
}: {
  title: string
  value: string | number
  sub: string
  color: 'blue' | 'green' | 'yellow' | 'purple'
}) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  }

  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

function InvoiceStatusCard({
  label, count, color
}: {
  label: string
  count: number
  color: 'green' | 'yellow' | 'red'
}) {
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${colors[color]}`} />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  )
}
