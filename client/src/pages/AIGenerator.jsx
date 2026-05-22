import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiCpu,
  FiFileText,
  FiTag,
  FiMessageSquare,
  FiCopy,
  FiSave,
  FiCheck,
  FiBox
} from 'react-icons/fi';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AIGenerator() {
  const location = useLocation();
  
  // Navigation preselection check
  const preselectedProduct = location.state?.preselectedProduct || null;

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description | tags | caption
  
  // Input fields state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Instagram');

  // Generation result states
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedTags, setGeneratedTags] = useState([]);
  const [generatedCaption, setGeneratedCaption] = useState('');

  // UI Utilities states
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/products?limit=100');
        if (data.success) {
          setProducts(data.products);
          
          if (preselectedProduct) {
            handleSelectProductChange(preselectedProduct._id, data.products);
          }
        }
      } catch (err) {
        console.error('Error loading products list:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [preselectedProduct]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectProductChange = (productId, productsList = products) => {
    setSelectedProduct(productId);
    if (!productId) {
      // Clear manual fields if reset
      setProductName('');
      setPrice('');
      setFeatures('');
      return;
    }

    const matched = productsList.find((p) => p._id === productId);
    if (matched) {
      setProductName(matched.name);
      setCategory(matched.category);
      setPrice(matched.price.toString());
      setFeatures(matched.description || '');
      // Load any existing generations
      setGeneratedDescription(matched.aiDescription || '');
      setGeneratedTags(matched.aiTags || []);
      setGeneratedCaption(matched.aiCaption || '');
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerAIGeneration = async () => {
    if (!productName.trim()) {
      return showToast('danger', 'Please enter a product title before running AI.');
    }

    try {
      setAiThinking(true);
      if (activeTab === 'description') {
        const { data } = await API.post('/ai/description', {
          productName,
          category,
          price: price ? parseFloat(price) : undefined,
          features,
        });
        if (data.success) {
          setGeneratedDescription(data.description);
          showToast('success', 'AI Copy description generated!');
        }
      } else if (activeTab === 'tags') {
        const { data } = await API.post('/ai/tags', {
          productName,
          category,
          description: features || generatedDescription,
        });
        if (data.success) {
          setGeneratedTags(data.tags);
          showToast('success', 'SEO keywords lists compiled!');
        }
      } else if (activeTab === 'caption') {
        const { data } = await API.post('/ai/caption', {
          productName,
          category,
          price: price ? parseFloat(price) : undefined,
          targetPlatform,
        });
        if (data.success) {
          setGeneratedCaption(data.caption);
          showToast('success', 'Social marketing caption ready!');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'AI synthesis node failed. Verify details.');
    } finally {
      setAiThinking(false);
    }
  };

  const handleSaveToProduct = async () => {
    if (!selectedProduct) {
      return showToast('danger', 'Syncing requires selecting a pre-existing catalog product.');
    }

    const payload = {};
    if (activeTab === 'description' && generatedDescription) {
      payload.aiDescription = generatedDescription;
    } else if (activeTab === 'tags' && generatedTags.length > 0) {
      payload.aiTags = generatedTags;
    } else if (activeTab === 'caption' && generatedCaption) {
      payload.aiCaption = generatedCaption;
    } else {
      return showToast('danger', 'No compiled generated assets found in active panel.');
    }

    try {
      setLoading(true);
      const { data } = await API.put(`/products/${selectedProduct}`, payload);
      if (data.success) {
        showToast('success', 'Successfully synchronized generated assets into MongoDB catalog!');
        // Update local list
        setProducts((prev) =>
          prev.map((p) => (p._id === selectedProduct ? { ...p, ...payload } : p))
        );
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to synchronize details to database.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

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
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          AI Creative Copywriting Studio
        </h2>
        <p className="text-sm text-dark-200 mt-1">
          Autonomous product descriptions, SEO optimization tags and platform marketing captions generator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Input Specifications Panel */}
        <div className="lg:col-span-2 glass-card p-6 border border-white/5 space-y-5 h-fit">
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 border-b border-dark-600/30 pb-3">
            <FiBox /> Product Spec Sheets
          </h4>

          {/* Select Product */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Link Catalog product (Recommended)
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => handleSelectProductChange(e.target.value)}
              className="input-dark"
            >
              <option value="" className="bg-dark-800">-- Enter Specs Manually --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} className="bg-dark-800">
                  {p.name} (${p.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Product Title *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. AeroSound Wireless Earbuds"
              className="input-dark"
            />
          </div>

          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Category Group
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-dark"
            >
              <option value="Electronics" className="bg-dark-800">Electronics</option>
              <option value="Clothing" className="bg-dark-800">Clothing</option>
              <option value="Home & Garden" className="bg-dark-800">Home & Garden</option>
              <option value="Sports" className="bg-dark-800">Sports</option>
              <option value="Books" className="bg-dark-800">Books</option>
              <option value="Beauty" className="bg-dark-800">Beauty</option>
              <option value="Food & Beverage" className="bg-dark-800">Food & Beverage</option>
              <option value="Toys" className="bg-dark-800">Toys</option>
              <option value="Automotive" className="bg-dark-800">Automotive</option>
              <option value="Other" className="bg-dark-800">Other</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Product Value ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 79.99"
              className="input-dark"
            />
          </div>

          {/* Features description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Key Features & Specs (Comma separated)
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="e.g. active noise cancellation, bluetooth 5.3, water resistant, 30h battery"
              className="input-dark"
            />
          </div>

          {activeTab === 'caption' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
                Target Marketing Channel
              </label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="input-dark"
              >
                <option value="Instagram" className="bg-dark-800">Instagram Feed</option>
                <option value="Twitter" className="bg-dark-800">X (Formerly Twitter)</option>
                <option value="Facebook" className="bg-dark-800">Facebook Ad</option>
                <option value="TikTok" className="bg-dark-800">TikTok Hooks</option>
                <option value="General" className="bg-dark-800">General Brand Tag</option>
              </select>
            </div>
          )}

          <button
            onClick={triggerAIGeneration}
            disabled={aiThinking}
            className="btn-glow w-full py-3.5 tracking-wider uppercase font-bold text-xs cursor-pointer mt-4"
          >
            <FiCpu /> {aiThinking ? 'AI is Synthesizing...' : 'Trigger Autonomous Synthesis'}
          </button>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Tab Selector Buttons */}
          <div className="flex bg-dark-800/80 p-1.5 rounded-xl border border-white/5 w-fit">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'description'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-dark-200 hover:text-white'
              }`}
            >
              <FiFileText /> SEO Description
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'tags'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-dark-200 hover:text-white'
              }`}
            >
              <FiTag /> Search Tags
            </button>
            <button
              onClick={() => setActiveTab('caption')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'caption'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-dark-200 hover:text-white'
              }`}
            >
              <FiMessageSquare /> Marketing Captions
            </button>
          </div>

          {/* AI Output Card */}
          <div className="glass-card p-6 border border-white/5 flex-1 flex flex-col justify-between min-h-[350px]">
            {aiThinking ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <LoadingSpinner />
                <p className="text-xs font-mono text-dark-300">PUMPING TOKENS IN NEURAL LAYERS...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                {/* 1. Description panel */}
                {activeTab === 'description' && (
                  <div className="space-y-4 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dark-300">
                      Generated SEO Copywriting
                    </h4>
                    {generatedDescription ? (
                      <p className="text-sm text-white font-medium leading-relaxed bg-dark-900/40 p-4 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto">
                        {generatedDescription}
                      </p>
                    ) : (
                      <div className="text-center py-12 text-xs text-dark-300">
                        No AI description compiled. Click "Trigger Autonomous Synthesis" to generate.
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Tags panel */}
                {activeTab === 'tags' && (
                  <div className="space-y-4 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dark-300">
                      SEO Keywords & Backlink Tags
                    </h4>
                    {generatedTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5 bg-dark-900/40 p-4 rounded-xl border border-white/5">
                        {generatedTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3.5 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-xs font-bold text-primary-300 tracking-wide uppercase flex items-center gap-1"
                          >
                            <FiTag className="text-[10px]" /> {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-xs text-dark-300">
                        No SEO tags generated yet.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Captions panel */}
                {activeTab === 'caption' && (
                  <div className="space-y-4 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dark-300">
                      Social Media Post Hook ({targetPlatform})
                    </h4>
                    {generatedCaption ? (
                      <p className="text-sm text-white font-medium leading-relaxed bg-dark-900/40 p-4 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto">
                        {generatedCaption}
                      </p>
                    ) : (
                      <div className="text-center py-12 text-xs text-dark-300">
                        No platform caption generated yet.
                      </div>
                    )}
                  </div>
                )}

                {/* Direct Action Utility Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-dark-600/35 mt-6">
                  {/* Copy Button */}
                  {((activeTab === 'description' && generatedDescription) ||
                    (activeTab === 'tags' && generatedTags.length > 0) ||
                    (activeTab === 'caption' && generatedCaption)) && (
                    <>
                      <button
                        onClick={() => {
                          const text =
                            activeTab === 'description'
                              ? generatedDescription
                              : activeTab === 'tags'
                              ? generatedTags.join(', ')
                              : generatedCaption;
                          handleCopy(text);
                        }}
                        className="btn-secondary py-2.5 px-5 cursor-pointer text-xs"
                      >
                        {copied ? (
                          <>
                            <FiCheck className="text-success-400 text-sm" /> Copied Asset
                          </>
                        ) : (
                          <>
                            <FiCopy className="text-sm" /> Copy Asset to Clipboard
                          </>
                        )}
                      </button>

                      {/* Sync to MongoDB */}
                      {selectedProduct && (
                        <button
                          onClick={handleSaveToProduct}
                          className="btn-glow py-2.5 px-5 cursor-pointer text-xs"
                        >
                          <FiSave className="text-sm" /> Synchronize to Product
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
