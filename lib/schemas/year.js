const Joi = require('joi');

module.exports = Joi.object({
  minYear: Joi.number(),
  maxYear: Joi.number(),
}).rename('min_year', 'minYear')
  .rename('max_year', 'maxYear');

