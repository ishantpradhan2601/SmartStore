const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const { search, category, status, sortBy, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'stock_asc') {
      sortOptions = { stock: 1 };
    } else if (sortBy === 'stock_desc') {
      sortOptions = { stock: -1 };
    } else if (sortBy === 'name_asc') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'name_desc') {
      sortOptions = { name: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      costPrice,
      stock,
      sku,
      images,
      status,
      aiDescription,
      aiTags,
      aiCaption
    } = req.body;

    // Generate SKU if not provided
    const finalSku = sku || `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Verify uniqueness of SKU for user
    if (sku) {
      const existingProduct = await Product.findOne({ sku: finalSku });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          error: 'A product with this SKU already exists',
        });
      }
    }

    const product = await Product.create({
      user: req.user.id,
      name,
      description,
      category,
      price,
      costPrice: costPrice || 0,
      stock: stock || 0,
      sku: finalSku,
      images: images || [],
      status: status || 'active',
      aiDescription,
      aiTags,
      aiCaption
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
