import { useEffect, useState } from 'react'
import client from '../api/client'
import * as XLSX from 'xlsx'
import { save } from '@tauri-apps/plugin-dialog'

export default function CorteCajaScreen() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState(
    new Date().toISOString().split('T')[0]
  )

  const fetchCorte = async () => {
    setLoading(true)
    try {
      const { data: res } = await client.get(
        `/reports/payments/?date_from=${dateFrom}&date_to=${dateTo}`
      )
      setData(res)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCorte() }, [])

    const exportExcel = async () => {
      if (!data?.results) return
      const rows = data.results.map((p: any) => ({
        'Referencia': p.reference,
        'Factura': p.invoice_number,
        'Usuario': p.user,
        'Monto': p.amount,
        'Método': p.method_display,
        'Fecha de pago': p.paid_at,
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Corte de Caja')
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

      const filePath = await save({
        defaultPath: `corte-caja-${dateFrom}-${dateTo}.xlsx`,
        filters: [{ name: 'Excel', extensions: ['xlsx'] }]
      })

      if (filePath) {
        const { writeFile } = await import('@tauri-apps/plugin-fs')
        await writeFile(filePath, new Uint8Array(buffer))
      }
    }

  const methodLabels: Record<string, string> = {
    cash: 'Efectivo', card: 'Tarjeta',
    transfer: 'Transferencia', online: 'En línea'
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Corte de Caja</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fecha inicio</label>
            <input type="date" value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fecha fin</label>
            <input type="date" value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={fetchCorte}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            Consultar
          </button>
          <button onClick={exportExcel}
            disabled={!data?.results?.length}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
            📥 Exportar Excel
          </button>
          <button onClick={() => window.print()}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : data ? (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-500">Total pagos</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{data.count}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-500">Total cobrado</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                ${Number(data.total_collected).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs text-gray-500 mb-2">Por método</p>
              {data.by_method?.map((m: any) => (
                <div key={m.method} className="flex justify-between text-sm">
                  <span className="text-gray-600">{methodLabels[m.method] || m.method}</span>
                  <span className="font-medium">${Number(m.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle */}
          {data.results?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Referencia', 'Factura', 'Usuario', 'Método', 'Monto', 'Fecha'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.results.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{p.reference || 'N/A'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.invoice_number}</td>
                      <td className="px-4 py-3 text-gray-600">{p.user}</td>
                      <td className="px-4 py-3 text-gray-600">{p.method_display}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">${p.amount} MXN</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(p.paid_at).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">No hay datos para el período seleccionado</div>
      )}
    </div>
  )
}
