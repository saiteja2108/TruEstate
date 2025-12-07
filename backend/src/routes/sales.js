const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// GET /api/sales
router.get('/', salesController.getSales);

module.exports = router;
