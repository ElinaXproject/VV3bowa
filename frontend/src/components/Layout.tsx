import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Folder, Download, Settings } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Strona główna' },
    { path: '/add', icon: <Plus size={20} />, label: 'Dodaj aplikację' },
    { path: '/folders', icon: <Folder size={20} />, label: 'Foldery' },
    { path: '/export', icon: <Download size={20} />, label: 'Eksport' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Ustawienia' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nawigacja */}
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <Link to="/" className="navbar-brand">
            WEBOWAW
          </Link>
          <div className="navbar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link flex items-center gap-1 ${
                  location.pathname === item.path ? 'text-neon' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Zawartość */}
      <main className="flex-1 container py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-4">
        <div className="container text-center text-muted">
          <p>Webowaw - Zbiór aplikacji | © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
