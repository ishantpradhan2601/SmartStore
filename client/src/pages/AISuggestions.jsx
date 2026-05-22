import { useState, useEffect } from 'react';
import {
  FiSliders,
  FiTrendingUp,
  FiShare2,
  FiCheckCircle,
  FiCpu,
  FiZap,
  FiCheck,
  FiX
} from 'react-icons/fi';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AISuggestions() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Recommendations States
  const [pricingRecs, setPricingRecs] = useState([]);
  const [trendingRecs, setTrendingRecs] = useState([]);
  const [crossSellingRecs, setCrossSellingRecs] = useState([]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      // Fetch products to summarize to suggestions API
      const productsRes = await API.get('/products?limit=50');
      let productsList = [];
      if (productsRes.data.success) {
        productsList = productsRes.data.products;
      }

      const { data } = await API.post('/ai/suggestions', { products: productsList });
      if (data.success) {
        setPricingRecs(data.pricingRecommendations || []);
        setTrendingRecs(data.trendingInsights || []);
        setCrossSellingRecs(data.crossSelling || []);
      }
    } catch (err) {
      console.error('Error compiling AI suggestions:', err.message);
      showToast('danger', 'Failed to retrieve strategic consult directives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAction = (type, title, listName) => {
    showToast('success', `Strategy "${title}" successfully accepted and dispatched!`);
    
    // Animate removal from active lists
    if (listName === 'pricing') {
      setPricingRecs((prev) => prev.filter((p) => p.title !== title));
    } else if (listName === 'trending') {
      setTrendingRecs((prev) => prev.filter((p) => p.title !== title));
    } else if (listName === 'cross') {
      setCrossSellingRecs((prev) => prev.filter((p) => p.title !== title));
    }
  };

  const handleDismiss = (title, listName) => {
    showToast('danger', `Strategy "${title}" dismissed.`);
    if (listName === 'pricing') {
      setPricingRecs((prev) => prev.filter((p) => p.title !== title));
    } else if (listName === 'trending') {
      setTrendingRecs((prev) => prev.filter((p) => p.title !== title));
    } else if (listName === 'cross') {
      setCrossSellingRecs((prev) => prev.filter((p) => p.title !== title));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderCard = (item, index, listName, Icon) => {
    const confidenceColors = {
      High: 'bg-success-500/10 border-success-500/20 text-success-400',
      Medium: 'bg-warning-500/10 border-warning-500/20 text-warning-400',
      Low: 'bg-danger-500/10 border-danger-500/20 text-danger-400',
    };

    const currentBadge = confidenceColors[item.confidence] || confidenceColors.Medium;

    return (
      <div
        key={item.title}
        className="glass-card p-6 border border-white/5 flex flex-col justify-between space-y-4 animate-fadeInUp hover:-translate-y-1.5 duration-300"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                <Icon className="text-base" />
              </span>
              <h4 className="font-extrabold text-white text-sm tracking-wide leading-tight">
                {item.title}
              </h4>
            </div>
            <span className={`badge ${currentBadge} text-[9px] font-black shrink-0`}>
              {item.confidence} CONF
            </span>
          </div>

          <p className="text-xs text-dark-200 leading-relaxed font-medium mt-2">
            {item.description}
          </p>
        </div>

        {/* Footer impact metric & actions */}
        <div className="pt-4 border-t border-dark-600/35 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-dark-300">
              Estimated Yield
            </span>
            <span className="text-xs font-extrabold text-success-400 flex items-center gap-0.5 mt-0.5">
              <FiZap className="text-[10px]" /> {item.impact}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDismiss(item.title, listName)}
              className="p-1.5 rounded-lg bg-dark-700/60 hover:bg-danger-500/20 text-dark-300 hover:text-danger-400 border border-white/5 transition-all cursor-pointer"
            >
              <FiX className="text-sm" />
            </button>
            <button
              onClick={() => handleAction('accept', item.title, listName)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <FiCheck className="text-xs" /> Deploy
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 relative">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-600/30 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Autonomous Strategic Advisor <FiCpu className="text-primary-400 animate-pulse" />
          </h2>
          <p className="text-sm text-dark-200 mt-1">
            Accept or schedule pricing recommendations, trending metrics and cross-selling campaigns.
          </p>
        </div>

        <button
          onClick={fetchSuggestions}
          className="btn-secondary text-xs uppercase tracking-wider font-bold"
        >
          Re-Analyze Database
        </button>
      </div>

      {/* 1. Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiSliders className="text-primary-400 text-lg" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            Pricing Adaptations recommendations
          </h3>
        </div>
        
        {pricingRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingRecs.map((item, idx) => renderCard(item, idx, 'pricing', FiSliders))}
          </div>
        ) : (
          <p className="text-xs text-dark-300 font-semibold italic bg-dark-900/40 p-4 rounded-xl border border-white/5">
            No pricing suggestions available at this time. All items priced optimally.
          </p>
        )}
      </div>

      {/* 2. Trending Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiTrendingUp className="text-accent-400 text-lg" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            Trending product & Market Insights
          </h3>
        </div>
        
        {trendingRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingRecs.map((item, idx) => renderCard(item, idx, 'trending', FiTrendingUp))}
          </div>
        ) : (
          <p className="text-xs text-dark-300 font-semibold italic bg-dark-900/40 p-4 rounded-xl border border-white/5">
            No active trend flags detected in global markets. Check back soon.
          </p>
        )}
      </div>

      {/* 3. Cross-selling Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FiShare2 className="text-success-400 text-lg" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            Cross-Selling & Basket Bundles campaigns
          </h3>
        </div>
        
        {crossSellingRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crossSellingRecs.map((item, idx) => renderCard(item, idx, 'cross', FiCheckCircle))}
          </div>
        ) : (
          <p className="text-xs text-dark-300 font-semibold italic bg-dark-900/40 p-4 rounded-xl border border-white/5">
            No cross-selling templates suggested for this inventory composition.
          </p>
        )}
      </div>
    </div>
  );
}
