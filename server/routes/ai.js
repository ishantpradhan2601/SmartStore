const express = require('express');
const {
  generateDescription,
  generateTags,
  generateCaption,
  getSuggestions,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/description', generateDescription);
router.post('/tags', generateTags);
router.post('/caption', generateCaption);
router.post('/suggestions', getSuggestions);

module.exports = router;
