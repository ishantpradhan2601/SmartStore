import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiBox,
  FiCpu,
  FiTrendingUp,
  FiSliders,
  FiAlertTriangle,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: FiGrid },
    { name: 'Products', path: '/products', icon: FiBox },
    { name: 'AI Generator', path: '/ai-generator', icon: FiCpu },
    { name: 'Analytics', path: '/analytics', icon: FiTrendingUp },
    { name: 'AI Suggestions', path: '/ai-suggestions', icon: FiSliders },
    { name: 'Inventory Alerts', path: '/inventory', icon: FiAlertTriangle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Core */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-800/90 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between transform transition-transform duration-300 ease-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 py-6">
          {/* Logo brand */}
          <div className="px-6 mb-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-primary-400 to-accent-300 bg-clip-text text-transparent">
                SmartStore AI
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-dark-300">
                AI-Powered E-Commerce
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide border transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/15 to-accent-500/5 border-primary-500/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                      : 'border-transparent text-dark-200 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon className={`text-lg transition-transform ${isActive ? 'scale-110 text-primary-400' : 'text-dark-300'}`} />
                      {item.name}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer profile info & logout */}
        <div className="p-4 border-t border-dark-600/30 bg-dark-900/40">
          <div className="flex items-center gap-3 px-2 py-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] font-semibold text-dark-300 truncate tracking-wide uppercase mt-0.5">
                {user?.storeName || 'My Store'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-danger-400 hover:text-white bg-danger-500/5 hover:bg-danger-500/25 border border-danger-500/10 hover:border-danger-500/30 transition-all cursor-pointer"
          >
            <FiLogOut className="text-sm" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
