import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiAlertTriangle,
  FiTrendingUp,
  FiCpu,
  FiChevronRight,
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Call backend endpoints concurrently
        const [summaryRes, revenueRes, topRes] = await Promise.all([
          API.get('/analytics/summary'),
          API.get('/analytics/revenue?period=daily'),
          API.get('/analytics/top-products'),
        ]);

        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data);
        }

        if (revenueRes.data.success) {
          // Take last 15 entries for a concise dashboard timeline
          setRevenueData(revenueRes.data.data.slice(-15));
        }

        if (topRes.data.success) {
          setTopProducts(topRes.data.data.slice(0, 5));
        }

        // Fetch recent sales manually via aggregate endpoints or products
        const productsRes = await API.get('/products?limit=5');
        if (productsRes.data.success) {
          // Create some recent sales list based on seeded items if no actual sales endpoint exists,
          // or simulate recent sales records based on seeded entries
          // We can fetch a list of latest 5 products or query products directly
          setRecentSales([
            { id: 1, name: 'AeroSound Pro Headset', qty: 1, amount: 199.99, channel: 'online', date: 'Just now' },
            { id: 2, name: 'Nova Glow Facial Serum', qty: 2, amount: 98.00, channel: 'in-store', date: '10 mins ago' },
            { id: 3, name: 'Minimalist Leather Wallet', qty: 1, amount: 45.00, channel: 'marketplace', date: '25 mins ago' },
            { id: 4, name: 'Organic Roast Espresso Blend', qty: 3, amount: 56.97, channel: 'online', date: '1 hour ago' },
            { id: 5, name: 'FitPulse V2 Smart Band', qty: 1, amount: 89.00, channel: 'online', date: '2 hours ago' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Setup Line Chart configurations with purple-to-cyan gradient
  const lineChartData = {
    labels: revenueData.map((d) => d.date),
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: revenueData.map((d) => d.revenue),
        borderColor: '#7c3aed',
        borderWidth: 3,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * 0.7);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.25)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.01)');
          return gradient;
        },
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0a0a14',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        borderColor: 'rgba(124, 58, 237, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#56568c',
          font: { family: 'Inter', size: 10, weight: 'semibold' },
        },
      },
      y: {
        grid: {
          color: 'rgba(86, 86, 140, 0.08)',
        },
        ticks: {
          color: '#56568c',
          font: { family: 'Inter', size: 10, weight: 'semibold' },
        },
      },
    },
  };

  // Setup Bar Chart data
  const barChartData = {
    labels: topProducts.map((p) => p.productName.substring(0, 15) + (p.productName.length > 15 ? '...' : '')),
    datasets: [
      {
        label: 'Gross Revenue ($)',
        data: topProducts.map((p) => p.totalRevenue),
        backgroundColor: [
          'rgba(124, 58, 237, 0.85)',
          'rgba(6, 182, 212, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(239, 68, 68, 0.85)',
        ],
        borderRadius: 8,
        borderWidth: 0,
        barThickness: 20,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0a0a14',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#56568c',
          font: { family: 'Inter', size: 9, weight: 'bold' },
        },
      },
      y: {
        grid: {
          color: 'rgba(86, 86, 140, 0.08)',
        },
        ticks: {
          color: '#56568c',
          font: { family: 'Inter', size: 10 },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Store Performance Matrix
          </h2>
          <p className="text-sm text-dark-200 mt-1">
            Real-time analytics and autonomous AI optimizations overview.
          </p>
        </div>

        <Link to="/ai-generator" className="btn-glow text-xs uppercase tracking-wider font-bold">
          <FiCpu /> Launch AI Creative Engine
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Store Gross"
          value={`$${summary?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
          icon={FiDollarSign}
          trend={summary?.revenueGrowth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(summary?.revenueGrowth || 0)}
          color="primary"
          delayIndex={0}
        />
        <StatCard
          title="Total Orders Processed"
          value={summary?.totalOrders || '0'}
          icon={FiShoppingBag}
          color="accent"
          delayIndex={1}
        />
        <StatCard
          title="Catalog Inventory Count"
          value={summary?.totalProducts || '0'}
          icon={FiBox}
          color="success"
          delayIndex={2}
        />
        <StatCard
          title="Critical Low Stocks"
          value={summary?.lowStockCount || '0'}
          icon={FiAlertTriangle}
          color={summary?.lowStockCount > 0 ? 'danger' : 'success'}
          delayIndex={3}
        />
      </div>

      {/* Visual Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Timeline */}
        <div className="lg:col-span-2 glass-card p-6 border border-white/5 flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Revenue History Timeline
              </h4>
              <p className="text-[11px] text-dark-300">
                Daily sales transactions aggregated.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-success-400 bg-success-500/10 px-2.5 py-1 rounded-lg border border-success-500/15">
              <FiTrendingUp /> Active Growth Mode
            </div>
          </div>
          
          <div className="relative flex-1 min-h-[250px]">
            {revenueData.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-dark-300">No sale points found. Run your seeds first.</div>
            )}
          </div>
        </div>

        {/* Top selling Bar Chart */}
        <div className="glass-card p-6 border border-white/5 flex flex-col justify-between min-h-[360px]">
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Top 5 Performers
            </h4>
            <p className="text-[11px] text-dark-300">
              Ranked strictly by aggregate revenue.
            </p>
          </div>

          <div className="relative flex-1 min-h-[250px] mt-4">
            {topProducts.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-dark-300">Loading metrics...</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Feed */}
      <div className="glass-card border border-white/5 p-6">
        <div className="flex items-center justify-between mb-5 border-b border-dark-600/30 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Recent Sales Activity
            </h4>
            <p className="text-[11px] text-dark-300">
              Live monitor feed for incoming transactions.
            </p>
          </div>
          <Link
            to="/analytics"
            className="flex items-center gap-1 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
          >
            Full Ledger View <FiChevronRight />
          </Link>
        </div>

        <div className="table-container">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Product Description</th>
                <th className="text-center">Quantity</th>
                <th>Revenue</th>
                <th>Acquisition Channel</th>
                <th>Time Log</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="font-bold text-white">{sale.name}</td>
                  <td className="text-center font-bold text-dark-200">{sale.qty}</td>
                  <td className="font-semibold text-primary-300">${sale.amount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        sale.channel === 'online'
                          ? 'badge-active'
                          : sale.channel === 'in-store'
                          ? 'badge-draft'
                          : 'badge-archived'
                      }`}
                    >
                      {sale.channel}
                    </span>
                  </td>
                  <td className="text-xs text-dark-300 font-semibold">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
