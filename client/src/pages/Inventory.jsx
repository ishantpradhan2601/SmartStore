import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiBox,
  FiActivity,
  FiCheckCircle,
  FiPlus,
  FiSliders
} from 'react-icons/fi';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [productsRes, alertsRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/analytics/inventory-alerts'),
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
      }

      if (alertsRes.data.success) {
        setLowStockAlerts(alertsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching inventory log:', err.message);
      showToast('danger', 'Failed to fetch inventory logistics ledgers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRestockClick = async (productId, currentStock, productName) => {
    try {
      // Direct fast restock: increase stock units by +25
      const newStock = currentStock + 25;
      const { data } = await API.put(`/products/${productId}`, { stock: newStock });
      if (data.success) {
        showToast('success', `Restocked "${productName}" by 25 units!`);
        loadInventory();
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'Restocking failed. Verify database link.');
    }
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  // Aggregate parameters
  const totalItems = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const healthyStock = products.filter((p) => p.stock >= 10).length;

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border text-xs font-bold uppercase tracking-wider animate-fadeInUp ${
            toast.type === 'success'
              ? 'bg-success-500/10 border-success-500/20 text-success-400'
              : 'bg-danger-500/10 border-danger-500/20 text-danger-400'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Logistics Stock Control Node
          </h2>
          <p className="text-sm text-dark-200 mt-1">
            Real-time track levels, restock channels, and threshold stock alerts.
          </p>
        </div>

        <button
          onClick={() => navigate('/products')}
          className="btn-glow text-xs uppercase tracking-wider font-bold cursor-pointer"
        >
          <FiPlus /> Manage Catalog Node
        </button>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total SKU cataloged"
          value={totalItems}
          icon={FiBox}
          color="primary"
          delayIndex={0}
        />
        <StatCard
          title="Critical Low stock"
          value={lowStock}
          icon={FiAlertTriangle}
          color={lowStock > 0 ? 'warning' : 'success'}
          delayIndex={1}
        />
        <StatCard
          title="Fully Out of Stock"
          value={outOfStock}
          icon={FiAlertTriangle}
          color={outOfStock > 0 ? 'danger' : 'success'}
          delayIndex={2}
        />
        <StatCard
          title="Optimal Healthy Level"
          value={healthyStock}
          icon={FiCheckCircle}
          color="success"
          delayIndex={3}
        />
      </div>

      {/* 1. Critical Low Stocks Warnings */}
      {lowStockAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-danger-400 flex items-center gap-2">
            <FiAlertTriangle className="animate-pulse" /> Critical Replenishment Demands
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lowStockAlerts.map((item) => (
              <div
                key={item._id}
                className="glass-card p-5 border border-danger-500/10 flex flex-col justify-between space-y-4 animate-fadeInUp shadow-[0_0_15px_rgba(239,68,68,0.02)]"
              >
                <div>
                  <h4 className="font-extrabold text-white text-sm tracking-wide">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-dark-300 font-mono mt-1 uppercase">
                    SKU: {item.sku}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-bold text-dark-200">Current Stock:</span>
                    <span className="badge badge-low text-xs animate-pulse">
                      {item.stock} Left
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-dark-600/35 mt-2">
                  <button
                    onClick={() => navigate('/ai-generator', { state: { preselectedProduct: item } })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 hover:bg-primary-500/20 text-dark-200 hover:text-white border border-white/5 text-xs font-bold transition-all cursor-pointer"
                  >
                    <FiSliders className="text-xs" /> AI Strategize
                  </button>
                  
                  <button
                    onClick={() => handleRestockClick(item._id, item.stock, item.name)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-success-500 to-emerald-600 hover:shadow-lg hover:shadow-success-500/20 text-white text-xs font-black transition-all cursor-pointer"
                  >
                    Quick Restock (+25)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Global Stock list with Progress bars */}
      <div className="glass-card border border-white/5 p-6">
        <div className="mb-5 border-b border-dark-600/30 pb-3">
          <h4 className="text-sm font-bold text-white tracking-wide">Global Stock Ledger Grid</h4>
          <p className="text-[11px] text-dark-300">Detailed visual metrics of stock items cataloged in this node.</p>
        </div>

        <div className="table-container">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Product SKU</th>
                <th>Category</th>
                <th>Units left</th>
                <th>Stock Level Status Bar</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                // Compute width ratio (max stock cap 100 for visual demonstration)
                const percentage = Math.min((item.stock / 100) * 100, 100);
                const isCritical = item.stock < 10;
                const isOutOfStock = item.stock === 0;

                return (
                  <tr key={item._id}>
                    <td>
                      <div className="font-bold text-white leading-tight">{item.name}</div>
                      <div className="text-[10px] text-dark-300 font-mono mt-1">SKU: {item.sku}</div>
                    </td>
                    <td className="font-semibold text-dark-200">{item.category}</td>
                    <td>
                      <span className={`badge ${isCritical ? 'badge-low animate-pulse' : 'badge-healthy'}`}>
                        {item.stock} Left
                      </span>
                    </td>
                    <td className="w-1/3">
                      <div className="space-y-1">
                        <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOutOfStock
                                ? 'bg-danger-500'
                                : isCritical
                                ? 'bg-gradient-to-r from-warning-500 to-amber-400'
                                : 'bg-gradient-to-r from-success-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-dark-300 uppercase">
                          <span>0</span>
                          <span>Healthy (100+)</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleRestockClick(item._id, item.stock, item.name)}
                        className="btn-secondary py-1.5 px-3 cursor-pointer text-xs font-bold"
                      >
                        Restock +25
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
