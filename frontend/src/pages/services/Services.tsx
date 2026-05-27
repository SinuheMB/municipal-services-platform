import { useEffect, useState } from 'react'
import type { Service, ServiceCategory } from '../../types'
import { formatCurrency } from '../../utils'
import client from '../../api/client'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services')

  useEffect(() => {
    Promise.all([
      client.get('/services/'),
      client.get('/services/categories/')
    ]).then(([servicesRes, categoriesRes]) => {
      setServices(servicesRes.data)
      setCategories(categoriesRes.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Servicios</h1>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
            activeTab === 'services'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Servicios ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Categorías ({categories.length})
        </button>
      </div>

      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Servicio</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Categoría</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Tarifa base</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Unidad</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{service.name}</td>
                  <td className="px-6 py-4 text-gray-500">{service.category_name}</td>
                  <td className="px-6 py-4 text-gray-800">{formatCurrency(service.base_rate)}</td>
                  <td className="px-6 py-4 text-gray-500">{service.unit}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">{cat.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cat.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {cat.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{cat.description || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
