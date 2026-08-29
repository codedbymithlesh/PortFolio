const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getPortfolio);
router.put('/', authMiddleware, updatePortfolio);

module.exports = router;
