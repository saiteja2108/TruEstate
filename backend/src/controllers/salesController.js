const salesService = require('../services/salesService');

async function getSales(req, res) {
  try {
    const query = req.query;
    const result = salesService.querySales(query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getSales };
