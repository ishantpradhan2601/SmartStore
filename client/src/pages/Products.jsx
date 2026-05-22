import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCpu,
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
  FiFilter
} from 'react-icons/fi';
import API from '../api/axios';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Food & Beverage',
  'Toys',
  'Automotive',
  'Other',
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        category,
        status,
        sortBy,
        page: page.toString(),
        limit: '8',
      });

      const { data } = await API.get(`/products?${params.toString()}`);
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error loading products:', err.message);
      showToast('danger', 'Failed to retrieve catalog data.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when criteria change
  useEffect(() => {
    fetchProducts();
  }, [category, status, sortBy, page]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitLoading(true);
      if (editingProduct) {
        // Edit flow
        const { data } = await API.put(`/products/${editingProduct._id}`, formData);
        if (data.success) {
          showToast('success', `Product "${formData.name}" successfully updated.`);
          setFormOpen(false);
          setEditingProduct(null);
          fetchProducts();
        }
      } else {
        // Create flow
        const { data } = await API.post('/products', formData);
        if (data.success) {
          showToast('success', `Product "${formData.name}" successfully created.`);
          setFormOpen(false);
          setPage(1);
          fetchProducts();
        }
      }
    } catch (err) {
      console.error(err);
      showToast('danger', err.response?.data?.error || 'Operation failed. Verify parameters.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!productToDelete) return;
    try {
      setSubmitLoading(true);
      const { data } = await API.delete(`/products/${productToDelete._id}`);
      if (data.success) {
        showToast('success', 'Product has been purged from system database.');
        setDeleteOpen(false);
        setProductToDelete(null);
        // Regress page if appropriate
        if (products.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchProducts();
        }
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to delete product.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
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

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            E-Commerce Inventory Node
          </h2>
          <p className="text-sm text-dark-200 mt-1">
            Store operations database with AI assistance shortcuts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
          className="btn-glow text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <FiPlus className="text-sm" /> Add Product Architecture
        </button>
      </div>

      {/* Database Filters Console */}
      <div className="glass-card p-5 border border-white/5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
              <FiSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog by product name..."
              className="input-dark pl-11"
            />
          </div>

          <button type="submit" className="btn-secondary text-xs uppercase tracking-widest font-semibold cursor-pointer">
            Trigger Filter
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-600/15">
          {/* Category filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-300 flex items-center gap-1">
              <FiGrid /> Category
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="input-dark py-2"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-300 flex items-center gap-1">
              <FiFilter /> Catalog Status
            </span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="input-dark py-2"
            >
              <option value="All" className="bg-dark-800">All Statuses</option>
              <option value="active" className="bg-dark-800">Active</option>
              <option value="draft" className="bg-dark-800">Draft</option>
              <option value="archived" className="bg-dark-800">Archived</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-300 flex items-center gap-1">
              <FiFilter /> Sort Ordering
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="input-dark py-2"
            >
              <option value="newest" className="bg-dark-800">Newest Created</option>
              <option value="price_asc" className="bg-dark-800">Price: Low to High</option>
              <option value="price_desc" className="bg-dark-800">Price: High to Low</option>
              <option value="stock_asc" className="bg-dark-800">Stock: Low to High</option>
              <option value="stock_desc" className="bg-dark-800">Stock: High to Low</option>
              <option value="name_asc" className="bg-dark-800">Name: A to Z</option>
              <option value="name_desc" className="bg-dark-800">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Database Table Container */}
      <div className="glass-card border border-white/5 p-6 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <div className="space-y-6">
            <div className="table-container">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Product Title</th>
                    <th>Category</th>
                    <th>SKU Number</th>
                    <th>Pricing</th>
                    <th>Stock Units</th>
                    <th>Node Status</th>
                    <th className="text-right">Database Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="font-bold text-white leading-tight">{item.name}</div>
                        <div className="text-[10px] text-dark-300 mt-1 max-w-xs truncate">{item.description}</div>
                      </td>
                      <td className="font-semibold text-dark-200">{item.category}</td>
                      <td className="font-mono text-xs text-dark-300 font-semibold">{item.sku}</td>
                      <td className="font-bold text-primary-300">${item.price.toFixed(2)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${item.stock < 10 ? 'badge-low animate-pulse' : 'badge-healthy'}`}>
                            {item.stock} Units
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              navigate('/ai-generator', { state: { preselectedProduct: item } });
                            }}
                            title="Generate AI copy"
                            className="p-2 rounded-lg bg-primary-500/5 hover:bg-primary-500/25 border border-primary-500/10 hover:border-primary-500/30 text-primary-400 hover:text-white transition-all cursor-pointer"
                          >
                            <FiCpu className="text-base" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(item);
                              setFormOpen(true);
                            }}
                            title="Edit specifications"
                            className="p-2 rounded-lg bg-accent-500/5 hover:bg-accent-500/25 border border-accent-500/10 hover:border-accent-500/30 text-accent-400 hover:text-white transition-all cursor-pointer"
                          >
                            <FiEdit className="text-base" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(item);
                              setDeleteOpen(true);
                            }}
                            title="Purge product"
                            className="p-2 rounded-lg bg-danger-500/5 hover:bg-danger-500/25 border border-danger-500/10 hover:border-danger-500/30 text-danger-400 hover:text-white transition-all cursor-pointer"
                          >
                            <FiTrash2 className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-dark-600/30">
                <span className="text-xs text-dark-300 font-semibold">
                  Showing page {page} of {pagination.totalPages} ({pagination.totalItems} elements)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-lg bg-dark-800/80 hover:bg-primary-500/20 text-dark-200 hover:text-white border border-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-lg bg-dark-800/80 hover:bg-primary-500/20 text-dark-200 hover:text-white border border-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <p className="text-dark-300 text-sm">No items matching criteria found in node database.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setStatus('All');
                setPage(1);
              }}
              className="btn-secondary py-1.5 px-4 text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* CRUD Form Popup Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? `Modify catalog product: "${editingProduct.name}"` : 'Construct New Product Entry'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setFormOpen(false);
            setEditingProduct(null);
          }}
          loading={submitLoading}
        />
      </Modal>

      {/* Purge Delete Warning Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setProductToDelete(null);
        }}
        title="Warning: Irreversible Purge Operation"
        size="sm"
      >
        <div className="space-y-6 text-center py-2 animate-fadeInUp">
          <p className="text-sm text-dark-200">
            Are you completely sure you want to permanently purge product{' '}
            <span className="font-extrabold text-white">"{productToDelete?.name}"</span> from database?
            All linked analytics histories will be detached.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setDeleteOpen(false);
                setProductToDelete(null);
              }}
              className="btn-secondary px-6"
              disabled={submitLoading}
            >
              Abend Purge
            </button>
            <button
              onClick={handleDeleteSubmit}
              className="btn-danger px-6"
              disabled={submitLoading}
            >
              {submitLoading ? 'Purging...' : 'Execute Purge'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
