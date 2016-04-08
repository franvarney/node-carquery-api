const Joi = require('joi');

module.exports = Joi.object({
  minimum: Joi.number(),
  maximum: Joi.number(),
}).rename('min_year', 'minimum')
  .rename('max_year', 'maximum');

