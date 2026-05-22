import { useState, useEffect } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  FiActivity,
  FiTrendingUp,
  FiShoppingBag,
  FiGrid
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';

// Register ArcElement
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily'); // daily | weekly | monthly
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [revenueRes, topRes, summaryRes] = await Promise.all([
          API.get(`/analytics/revenue?period=${period}`),
          API.get('/analytics/top-products'),
          API.get('/analytics/summary'),
        ]);

        if (revenueRes.data.success) {
          setRevenueHistory(revenueRes.data.data);
        }

        if (topRes.data.success) {
          setTopProducts(topRes.data.data);
        }

        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching analytics details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading && revenueHistory.length === 0) {
    return <LoadingSpinner />;
  }

  // Setup Large Area Line Chart
  const lineData = {
    labels: revenueHistory.map((h) => h.date),
    datasets: [
      {
        label: 'Gross Sales ($)',
        data: revenueHistory.map((h) => h.revenue),
        borderColor: '#a78bfa',
        borderWidth: 3.5,
        pointBackgroundColor: '#22d3ee',
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * 0.9);
          gradient.addColorStop(0, 'rgba(167, 139, 250, 0.28)');
          gradient.addColorStop(1, 'rgba(34, 211, 238, 0.01)');
          return gradient;
        },
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0a0a14',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
        borderColor: 'rgba(167, 139, 250, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#56568c', font: { family: 'Inter', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(86, 86, 140, 0.08)' },
        ticks: { color: '#56568c', font: { family: 'Inter', size: 10 } },
      },
    },
  };

  // Mock Categories analysis from seeded product data
  const categorySummaryData = {
    labels: ['Electronics', 'Beauty', 'Sports', 'Home & Garden', 'Food & Beverage'],
    datasets: [
      {
        data: [42, 21, 18, 11, 8],
        backgroundColor: [
          'rgba(124, 58, 237, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderWidth: 1,
        borderColor: '#0a0a14',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#bfbfe0',
          font: { family: 'Inter', size: 11, weight: 'semibold' },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#0a0a14',
        cornerRadius: 8,
        padding: 10,
      },
    },
    cutout: '72%',
  };

  // Horizontal bar chart configuration
  const barData = {
    labels: topProducts.map((p) => p.productName.substring(0, 12)),
    datasets: [
      {
        label: 'Gross Sold ($)',
        data: topProducts.map((p) => p.totalRevenue),
        backgroundColor: 'rgba(6, 182, 212, 0.85)',
        borderRadius: 6,
        barThickness: 15,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(86, 86, 140, 0.08)' },
        ticks: { color: '#56568c', font: { family: 'Inter', size: 10 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#bfbfe0', font: { family: 'Inter', size: 10, weight: 'bold' } },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Store intelligence Ledgers
          </h2>
          <p className="text-sm text-dark-200 mt-1">
            Analyze revenue timelines, category configurations and products distributions.
          </p>
        </div>

        {/* Period Selector Buttons */}
        <div className="flex bg-dark-800/80 p-1 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              period === 'daily'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-dark-200 hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              period === 'weekly'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-dark-200 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              period === 'monthly'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-dark-200 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Consolidated Net Store Gross"
          value={`$${summary?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`}
          icon={FiTrendingUp}
          trend={summary?.revenueGrowth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(summary?.revenueGrowth || 0)}
          color="primary"
          delayIndex={0}
        />
        <StatCard
          title="Last 30 Days Revenue"
          value={`$${summary?.recentRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`}
          icon={FiActivity}
          color="accent"
          delayIndex={1}
        />
        <StatCard
          title="Total Transactions Count"
          value={summary?.totalOrders || '0'}
          icon={FiShoppingBag}
          color="success"
          delayIndex={2}
        />
      </div>

      {/* Large line chart panel */}
      <div className="glass-card p-6 border border-white/5 flex flex-col justify-between min-h-[380px]">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white tracking-wide">Gross Store Sales Timeline</h4>
          <p className="text-[11px] text-dark-300">Revenue aggregation trends based on selection ({period}).</p>
        </div>
        <div className="relative flex-1 min-h-[260px]">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Categories & Top selling distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share */}
        <div className="glass-card p-6 border border-white/5 flex flex-col justify-between min-h-[320px]">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Category Sales Share (%)</h4>
            <p className="text-[11px] text-dark-300">Composition of store transactions grouped by catalog category.</p>
          </div>
          <div className="relative flex-1 min-h-[180px] flex items-center justify-center">
            <Doughnut data={categorySummaryData} options={doughnutOptions} />
          </div>
        </div>

        {/* Top items volume */}
        <div className="glass-card p-6 border border-white/5 flex flex-col justify-between min-h-[320px]">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Top 5 Products - Gross Revenue ($)</h4>
            <p className="text-[11px] text-dark-300">Ranked product assets ledger values.</p>
          </div>
          <div className="relative flex-1 min-h-[180px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
