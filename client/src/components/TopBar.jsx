import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function TopBar({ onMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Retrieve path-based screen headers
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'System Command Center';
      case '/products':
        return 'Product Catalog Architecture';
      case '/ai-generator':
        return 'AI Creative Engine';
      case '/analytics':
        return 'Business Intelligence Insights';
      case '/ai-suggestions':
        return 'Smart Sales & Pricing Strategist';
      case '/inventory':
        return 'Global Stock Logistics';
      default:
        return 'SmartStore AI';
    }
  };

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const { data } = await API.get('/analytics/inventory-alerts');
        if (data.success) {
          setLowStockCount(data.count);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err.message);
      }
    };

    fetchLowStockCount();
    // Poll every 45s for updates
    const interval = setInterval(fetchLowStockCount, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-30 flex items-center justify-between px-6 bg-dark-900/60 backdrop-blur-md border-b border-white/5 transition-all">
      {/* Toggler & Page Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-dark-800/80 hover:bg-primary-500/20 text-dark-200 hover:text-white border border-white/5 md:hidden transition-all"
        >
          <FiMenu className="text-xl" />
        </button>
        <h1 className="text-sm md:text-base font-extrabold text-white tracking-wide uppercase">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Notifications Center */}
      <div className="flex items-center gap-4">
        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-dark-800/80 hover:bg-primary-500/20 text-dark-200 hover:text-white border border-white/5 transition-all relative"
          >
            <FiBell className="text-xl" />
            {lowStockCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-danger-500 text-[9px] font-black text-white flex items-center justify-center border border-dark-900 animate-pulse">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Simple Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-card p-4 border border-white/10 shadow-2xl z-50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark-200 pb-2 border-b border-dark-600/30 mb-2">
                Notifications Center
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {lowStockCount > 0 ? (
                  <div className="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-danger-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs font-bold text-white">Stock Warnings</p>
                      <p className="text-[11px] text-dark-200 mt-0.5">
                        You have {lowStockCount} items currently running critical on stock level. Check your Inventory alerts.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-dark-300 text-center py-4">No new alerts. All systems nominal.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-dark-600/35">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-white leading-none">
              {user?.name || 'Administrator'}
            </p>
            <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest leading-none mt-1 inline-block">
              {user?.role || 'Owner'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-dark-700 border border-white/5 flex items-center justify-center font-bold text-dark-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
          </div>
        </div>
      </div>
    </header>
  );
}
