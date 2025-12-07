const dbUtil = require('../utils/db');
const path = require('path');

function querySales(query) {
  const dbPath = path.join(__dirname, '..', '..', 'data', 'sales.db');
  // normalize incoming query parameters
  const params = {
    q: query.q || undefined,
    region: query.region || undefined,
    gender: query.gender || undefined,
    ageMin: query.ageMin || undefined,
    ageMax: query.ageMax || undefined,
    category: query.category || undefined,
    tags: query.tags || undefined,
    paymentMethod: query.paymentMethod || undefined,
    startDate: query.startDate || undefined,
    endDate: query.endDate || undefined,
    sort: query.sort || 'date_desc',
    page: query.page ? Number(query.page) : 1,
    perPage: query.perPage ? Number(query.perPage) : 10
  };

  const result = dbUtil.querySales(params, dbPath);
  return result;
}

module.exports = { querySales };
