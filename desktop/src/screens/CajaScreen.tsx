import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import type { ServiceAccount, Invoice } from '../types'

export default function CajaScreen() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [account, setAccount] = useState<ServiceAccount | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('cash')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    setAccount(null)
    setInvoices([])
    setMessage('')
    try {
      const { data } = await client.get('/services/accounts/')
      const found = data.find((a: ServiceAccount) =>
        a.account_number.toLowerCase().includes(search.toLowerCase()) ||
        a.user_username.toLowerCase().includes(search.toLowerCase())
      )
      if (found) {
        setAccount(found)
        const inv = await client.get('/billing/invoices/')
        const pending = inv.data.filter((i: Invoice) =>
          i.account_number === found.account_number &&
          i.status === 'pending'
        )
        setInvoices(pending)
        if (pending.length === 0) setMessage('No hay facturas pendientes para esta cuenta')
      } else {
        setMessage('No se encontró ninguna cuenta con ese número o nombre')
      }
    } catch {
      setMessage('Error al buscar la cuenta')
    } finally {
      setSearching(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedInvoice) return
    setLoading(true)
    setMessage('')
    try {
      await client.post('/billing/payments/', {
        invoice: selectedInvoice.id,
        amount: selectedInvoice.total,
        method,
        reference: `CAJA-${Date.now()}`
      })
      setMessage(`✅ Pago registrado correctamente · Factura ${selectedInvoice.invoice_number}`)
      setInvoices(invoices.filter(i => i.id !== selectedInvoice.id))
      setSelectedInvoice(null)
      window.print()
    } catch {
      setMessage('❌ Error al registrar el pago')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">Módulo de Caja</h1>
          <p className="text-gray-400 text-xs">Plataforma Municipal</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Buscar cuenta</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Número de cuenta o nombre del usuario"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {searching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Datos de la cuenta */}
        {account && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Datos de la cuenta</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Número de cuenta</p>
                <p className="font-medium text-gray-800">{account.account_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Titular</p>
                <p className="font-medium text-gray-800">{account.user_username}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Servicio</p>
                <p className="font-medium text-gray-800">{account.service_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Dirección</p>
                <p className="font-medium text-gray-800">{account.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Facturas pendientes */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Facturas pendientes ({invoices.length})
            </h2>
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedInvoice?.id === inv.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{inv.invoice_number}</p>
                      <p className="text-sm text-gray-500">
                        Período: {inv.period_start} / {inv.period_end}
                      </p>
                      <p className="text-sm text-gray-500">Vence: {inv.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">${inv.total}</p>
                      <p className="text-xs text-gray-500">MXN</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel de pago */}
        {selectedInvoice && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Registrar pago</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Factura seleccionada</p>
                <p className="font-bold text-lg text-gray-800">{selectedInvoice.invoice_number}</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">${selectedInvoice.total} MXN</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de pago
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['cash', 'card', 'transfer'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                        method === m
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {m === 'cash' ? '💵 Efectivo' : m === 'card' ? '💳 Tarjeta' : '🏦 Transferencia'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 text-lg"
              >
                {loading ? 'Procesando...' : `Confirmar pago · $${selectedInvoice.total} MXN`}
              </button>
            </div>
          </div>
        )}

        {/* Mensaje */}
        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
            message.startsWith('✅')
              ? 'bg-green-50 text-green-700'
              : message.startsWith('❌')
              ? 'bg-red-50 text-red-700'
              : 'bg-gray-50 text-gray-600'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
