import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/services', label: 'Servicios', icon: '🔧' },
  { to: '/billing', label: 'Facturación', icon: '🧾' },
  { to: '/reports', label: 'Reportes', icon: '📈' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed">
      <div className="p-6 border-b border-gray-700">
        <h2 className="font-bold text-lg">Plataforma Municipal</h2>
        <p className="text-gray-400 text-sm mt-1">{user?.username}</p>
        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
          {user?.role}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
