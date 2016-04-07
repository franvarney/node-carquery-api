const Joi = require('joi')

const Model = require('./model')

module.exports = Joi.array().items(Model).options({ stripUnknown: true })
