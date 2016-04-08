const Joi = require('joi');
const Request = require('request');

const Schemas = require('./schemas');

const CARQUERY_API_URL = 'http://www.carqueryapi.com/api/0.3/';

exports.request = function (cmd, schema, options, done) {
  if (typeof options === 'function') {
    done = options;
    options = {};
  }

  const requestOptions = {
    url: CARQUERY_API_URL,
    qs: { cmd },
    json: true,
  };

  requestOptions.qs = Object.assign(requestOptions.qs, options);

  Request.get(requestOptions, (err, response, body) => {
    if (err) return done(err);

    if (!body || body.length < 1) return done();
    if (body.error) return done(new Error(body.error));

    body = body[Object.keys(body)[0]];

    Joi.validate(body, Schemas[schema], (err, formatted) => {
      if (err) return done(err);
      return done(null, formatted);
    });
  });
};
