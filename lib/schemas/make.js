const Joi = require('joi')

var make = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string(),
  isCommon: Joi.number(),
  country: Joi.string()
}).rename('make_id', 'id')
  .rename('make_display', 'name')
  .rename('make_is_common', 'isCommon')
  .rename('make_country', 'country')

module.exports = Joi.array().items(make)
