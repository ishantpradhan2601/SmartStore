const Sale = require('../models/Sale');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get revenue analytics over time
// @route   GET /api/analytics/revenue
// @access  Private
const getRevenue = async (req, res, next) => {
  try {
    const { period = 'daily' } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    let format = '%Y-%m-%d'; // Daily default
    if (period === 'weekly') {
      format = '%Y-W%V'; // Weekly format
    } else if (period === 'monthly') {
      format = '%Y-%m'; // Monthly format
    }

    const salesData = await Sale.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $dateToString: { format: format, date: '$date' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: { $round: ['$revenue', 2] },
          orders: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private
const getTopProducts = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const topProducts = await Sale.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$product',
          productName: { $first: '$productName' },
          totalRevenue: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          productName: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          totalQuantity: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary numbers for dashboard
// @route   GET /api/analytics/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Total revenue & orders
    const salesStats = await Sale.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = salesStats[0]?.totalRevenue || 0;
    const totalOrders = salesStats[0]?.totalOrders || 0;

    // 2. Total products count
    const totalProducts = await Product.countDocuments({ user: req.user.id });

    // 3. Low stock count
    const lowStockCount = await Product.countDocuments({
      user: req.user.id,
      stock: { $lt: 10 },
    });

    // 4. Growth Metric: Last 30 days vs previous 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentSales = await Sale.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: thirtyDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const previousSales = await Sale.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const recentRevenue = recentSales[0]?.revenue || 0;
    const previousRevenue = previousSales[0]?.revenue || 0;

    let revenueGrowth = 0;
    if (previousRevenue > 0) {
      revenueGrowth = ((recentRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (recentRevenue > 0) {
      revenueGrowth = 100; // 100% growth if starting from 0
    }

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        lowStockCount,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        recentRevenue: Math.round(recentRevenue * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock inventory items
// @route   GET /api/analytics/inventory-alerts
// @access  Private
const getInventoryAlerts = async (req, res, next) => {
  try {
    const alerts = await Product.find({
      user: req.user.id,
      stock: { $lt: 10 },
    }).sort({ stock: 1 });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRevenue,
  getTopProducts,
  getSummary,
  getInventoryAlerts,
};
