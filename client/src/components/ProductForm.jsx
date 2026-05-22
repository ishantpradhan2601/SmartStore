import { useState, useEffect } from 'react';

const CATEGORIES = [
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

export default function ProductForm({
  product = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price: '',
    costPrice: '',
    stock: '',
    sku: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Electronics',
        price: product.price || '',
        costPrice: product.costPrice || '',
        stock: product.stock || '',
        sku: product.sku || '',
        status: product.status || 'active',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.price === '' || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (formData.costPrice !== '' && (isNaN(formData.costPrice) || parseFloat(formData.costPrice) < 0)) {
      newErrors.costPrice = 'Cost price must be positive';
    }
    if (formData.stock === '' || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert fields appropriately before sending
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice !== '' ? parseFloat(formData.costPrice) : 0,
      stock: parseInt(formData.stock),
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Product Title *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. AeroSound Wireless Earbuds"
            className="input-dark"
            disabled={loading}
          />
          {errors.name && <p className="text-xs text-danger-400 font-semibold">{errors.name}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-dark"
            disabled={loading}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-dark-800">
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-danger-400 font-semibold">{errors.category}</p>}
        </div>

        {/* SKU */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            SKU Code (Auto-generated if empty)
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. SKU-AERO-01"
            className="input-dark"
            disabled={loading}
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Selling Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="99.99"
            step="0.01"
            className="input-dark"
            disabled={loading}
          />
          {errors.price && <p className="text-xs text-danger-400 font-semibold">{errors.price}</p>}
        </div>

        {/* Cost Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Cost price ($)
          </label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            placeholder="45.00"
            step="0.01"
            className="input-dark"
            disabled={loading}
          />
          {errors.costPrice && <p className="text-xs text-danger-400 font-semibold">{errors.costPrice}</p>}
        </div>

        {/* Stock */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Initial Stock Level *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="15"
            className="input-dark"
            disabled={loading}
          />
          {errors.stock && <p className="text-xs text-danger-400 font-semibold">{errors.stock}</p>}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-dark"
            disabled={loading}
          >
            <option value="active" className="bg-dark-800">Active</option>
            <option value="draft" className="bg-dark-800">Draft</option>
            <option value="archived" className="bg-dark-800">Archived</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
            Product Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter full specifications, details and sales points..."
            className="input-dark"
            disabled={loading}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-600/30 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary py-2 px-6"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-glow py-2 px-6"
          disabled={loading}
        >
          {loading ? 'Submitting...' : product ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
