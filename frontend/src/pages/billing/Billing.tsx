import { useEffect, useState } from 'react'
import type { Invoice } from '../../types'
import { formatCurrency, formatDate, getStatusColor } from '../../utils'
import client from '../../api/client'

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    client.get('/billing/invoices/')
      .then(({ data }) => setInvoices(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? invoices
    : invoices.filter((inv) => inv.status === filter)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Facturación</h1>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'paid', 'overdue', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'
            }`}
          >
            {s === 'all' ? 'Todas' :
             s === 'pending' ? 'Pendientes' :
             s === 'paid' ? 'Pagadas' :
             s === 'overdue' ? 'Vencidas' : 'Canceladas'}
            {' '}
            ({s === 'all' ? invoices.length : invoices.filter(i => i.status === s).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">No. Factura</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Cuenta</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Período</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Vencimiento</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{invoice.invoice_number}</td>
                <td className="px-6 py-4 text-gray-500">{invoice.account_number}</td>
                <td className="px-6 py-4 text-gray-500">{invoice.user_username}</td>
                <td className="px-6 py-4 text-gray-500">
                  {invoice.period_start} / {invoice.period_end}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {formatCurrency(invoice.total)}
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDate(invoice.due_date)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status_display}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay facturas con este filtro
          </div>
        )}
      </div>
    </div>
  )
}
