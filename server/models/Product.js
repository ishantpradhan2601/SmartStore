const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
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
    ],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  costPrice: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  images: {
    type: [String],
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active',
  },
  aiDescription: {
    type: String,
  },
  aiTags: {
    type: [String],
  },
  aiCaption: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtuals
productSchema.virtual('profit').get(function () {
  return this.price - this.costPrice;
});

productSchema.virtual('isLowStock').get(function () {
  return this.stock < 10;
});

// Ensure virtuals are included in JSON and Object output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
