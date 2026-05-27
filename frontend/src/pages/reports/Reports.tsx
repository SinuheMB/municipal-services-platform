import { useEffect, useState } from 'react'
import { formatCurrency } from '../../utils'
import client from '../../api/client'

export default function Reports() {
  const [invoiceReport, setInvoiceReport] = useState<any>(null)
  const [paymentReport, setPaymentReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get('/reports/invoices/'),
      client.get('/reports/payments/')
    ]).then(([invRes, payRes]) => {
      setInvoiceReport(invRes.data)
      setPaymentReport(payRes.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Resumen de Facturas</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total facturas</span>
              <span className="font-medium">{invoiceReport?.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monto total</span>
              <span className="font-medium">{formatCurrency(invoiceReport?.total_amount || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Resumen de Pagos</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total pagos</span>
              <span className="font-medium">{paymentReport?.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total cobrado</span>
              <span className="font-medium">{formatCurrency(paymentReport?.total_collected || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {paymentReport?.by_method?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Pagos por método</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentReport.by_method.map((m: any) => (
              <div key={m.method} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 capitalize">{m.method}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{m.count}</p>
                <p className="text-sm text-gray-500">{formatCurrency(m.total)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
