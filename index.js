const CarQuery = require('./lib/car-query');

module.exports = {
  getMakes: CarQuery.request.bind(null, 'getMakes', 'make'),
  getModel: CarQuery.request.bind(null, 'getModel', 'model'),
  getModels: CarQuery.request.bind(null, 'getModels', 'models'),
  getTrims: CarQuery.request.bind(null, 'getTrims', 'trim'),
  getYears: CarQuery.request.bind(null, 'getYears', 'year'),
};
