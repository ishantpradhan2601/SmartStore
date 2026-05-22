const express = require('express');
const {
  getRevenue,
  getTopProducts,
  getSummary,
  getInventoryAlerts,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/revenue', getRevenue);
router.get('/top-products', getTopProducts);
router.get('/summary', getSummary);
router.get('/inventory-alerts', getInventoryAlerts);

module.exports = router;
