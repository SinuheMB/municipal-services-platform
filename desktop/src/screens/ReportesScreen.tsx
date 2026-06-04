import { useEffect, useState } from 'react'
import client from '../api/client'
import * as XLSX from 'xlsx'

export default function ReportesScreen() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    Promise.all([
      client.get('/billing/invoices/'),
      client.get('/reports/dashboard/'),
    ]).then(([invRes, dashRes]) => {
      setInvoices(invRes.data)
      setDashboard(dashRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = statusFilter === 'all'
    ? invoices
    : invoices.filter(i => i.status === statusFilter)

  const exportExcel = async () => {
    const rows = filtered.map((inv: any) => ({
      'No. Factura': inv.invoice_number,
      'Cuenta': inv.account_number,
      'Usuario': inv.user_username,
      'Período inicio': inv.period_start,
      'Período fin': inv.period_end,
      'Monto': inv.amount,
      'IVA': inv.tax,
      'Total': inv.total,
      'Estatus': inv.status_display,
      'Vencimiento': inv.due_date,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas')
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

    const { save } = await import('@tauri-apps/plugin-dialog')
    const filePath = await save({
      defaultPath: `reporte-facturas-${new Date().toISOString().split('T')[0]}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    })

    if (filePath) {
      const { writeFile } = await import('@tauri-apps/plugin-fs')
      await writeFile(filePath, new Uint8Array(buffer))
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  }

  if (loading) return (
    <div className="text-center py-12 text-gray-400">Cargando...</div>
  )

  return (
    <div className="space-y-6">
      {/* Resumen dashboard */}
      {dashboard && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total usuarios', value: dashboard.users?.total, color: 'bg-blue-50' },
            { label: 'Cuentas activas', value: dashboard.services?.active_accounts, color: 'bg-green-50' },
            { label: 'Facturas pendientes', value: dashboard.invoices?.pending, color: 'bg-yellow-50' },
            { label: 'Cobrado este mes', value: `$${dashboard.payments?.total_this_month?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, color: 'bg-purple-50' },
          ].map((card) => (
            <div key={card.label} className={`${card.color} rounded-xl p-4`}>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros y exportación */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Reporte de Facturas</h2>
          <div className="flex gap-3">
            <button onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              📥 Exportar Excel
            </button>
            <button onClick={() => window.print()}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              🖨️ Imprimir
            </button>
          </div>
        </div>

        {/* Filtros de estatus */}
        <div className="flex gap-2 flex-wrap mb-4">
          {[
            { id: 'all', label: `Todas (${invoices.length})` },
            { id: 'pending', label: `Pendientes (${invoices.filter(i => i.status === 'pending').length})` },
            { id: 'paid', label: `Pagadas (${invoices.filter(i => i.status === 'paid').length})` },
            { id: 'overdue', label: `Vencidas (${invoices.filter(i => i.status === 'overdue').length})` },
          ].map(f => (
            <button key={f.id} onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                statusFilter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['No. Factura', 'Cuenta', 'Usuario', 'Total', 'Vencimiento', 'Estatus'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.account_number}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.user_username}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">${inv.total} MXN</td>
                  <td className="px-4 py-3 text-gray-500">{inv.due_date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>
                      {inv.status_display}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">No hay facturas con este filtro</div>
          )}
        </div>
      </div>
    </div>
  )
}
