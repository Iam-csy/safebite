import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
      <span className="text-white text-lg">🛡️</span>
    </div>
    <span className="font-display font-bold text-lg text-gray-900">
      Safe<span className="text-primary">Bite</span> AI
    </span>
  </Link>
);

export default function Navbar() {
  const { user, logout, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardLink = isAdmin ? '/admin' : isOwner ? '/owner' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/search" className={`btn-ghost ${location.pathname === '/search' ? 'text-primary bg-primary-50' : ''}`}>
              🔍 Find Safe Food
            </Link>
            <Link to="/leaderboard" className="btn-ghost">🏆 Leaderboard</Link>
            {user && (
              <Link to="/freshness" className="btn-ghost">🥦 Freshness Check</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={dashboardLink} className="btn-ghost">
                  <span className="mr-1">{isAdmin ? '⚙️' : isOwner ? '🏪' : '👤'}</span>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="btn-outline text-sm py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 animate-slide-up">
          <Link to="/search" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">🔍 Find Safe Food</Link>
          <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">🏆 Leaderboard</Link>
          {user ? (
            <>
              <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">📊 Dashboard</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-sm font-medium text-red-600">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block btn-primary text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
