import { useState } from 'react'
import CorteCajaScreen from './CorteCajaScreen'
import ReportesScreen from './ReportesScreen'
import { useNavigate } from 'react-router-dom'

type Tab = 'corte' | 'reportes'

export default function AdminScreen() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('corte')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
        <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
            <h1 className="text-lg font-bold">Módulo Administrativo</h1>
            <p className="text-gray-400 text-xs">Plataforma Municipal · Solo administradores</p>
        </div>
        <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
        >
            Cerrar sesión
        </button>
        </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {([
            { id: 'corte', label: '📊 Corte de Caja' },
            { id: 'reportes', label: '📈 Reportes y Excel' },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {activeTab === 'corte' && <CorteCajaScreen />}
        {activeTab === 'reportes' && <ReportesScreen />}
      </div>
    </div>
  )
}
