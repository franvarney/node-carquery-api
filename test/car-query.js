const Code = require('code');
const Lab = require('lab');
const Joi = require('joi');
const Nock = require('nock');
const Request = require('request');
const Sinon = require('sinon');

const CarQuery = require('../lib/car-query');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const after = lab.after;
const before = lab.before;
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

describe('lib/car-query', () => {
  before((done) => {
    Nock.disableNetConnect();
    Nock('http://example.com')
      .get('/')
      .query({ cmd: 'testCommand' })
      .reply(200, { min_year: 2009, max_year: 2016 });
    Sinon.stub(Request, 'get');
    Sinon.stub(Joi, 'validate');
    done();
  });

  beforeEach((done) => {
    Request.get.yields(new Error('request error'));
    Joi.validate.yields(new Error('validate error'));
    done();
  });

  after((done) => {
    Nock.cleanAll();
    Nock.enableNetConnect();
    Request.get.restore();
    Joi.validate.restore();
    done();
  });

  describe('when called with a command', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 }, { test: true });
      Joi.validate.yields(null, { test: true });
      done();
    });

    it('should make a request to the API with `cmd` set to the command', (done) => {
      CarQuery.request('testCommand', 'test', {}, (err, results) => {
        expect(Request.get.called).to.be.true();
        expect(err).to.be.null();
        expect(results).to.deep.equal({ test: true });
        done();
      });
    });
  });

  describe('when called with a schema', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 }, { min_year: 2009, max_year: 2016 });
      Joi.validate.yields(null, { minimum: 2009, maximum: 2016 });
      done();
    });

    it('should format the response', (done) => {
      CarQuery.request('testCommand', 'year', {}, (err, results) => {
        expect(Joi.validate.called).to.be.true();
        expect(err).to.be.null();
        expect(results).to.deep.equal({ minimum: 2009, maximum: 2016 });
        done();
      });
    });
  });

  describe('when options are passed in', () => {
    beforeEach((done) => {
      Nock('http://example.com')
        .get('/')
        .query({ cmd: 'testCommand', paramOption: true })
        .reply(200, { test: true });
      Request.get.yields(null, { statusCode: 200 }, { test: true });
      Joi.validate.yields(null, { test: true });
      done();
    });

    it('should include those options in the query', (done) => {
      CarQuery.request('testCommand', 'year', { paramOption: true }, (err, results) => {
        expect(Request.get.calledWith({
          url: 'http://www.carqueryapi.com/api/0.3/',
          qs: { cmd: 'testCommand', paramOption: true },
          json: true,
        })).to.be.true();
        expect(err).to.be.null();
        expect(results).to.deep.equal({ test: true });
        done();
      });
    });
  });

  describe('when called without options', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 }, { test: true });
      Joi.validate.yields(null, { test: true });
      done();
    });

    it('should reset `done` to a function', (done) => {
      CarQuery.request('testCommand', 'year', (err, results) => {
        expect(err).to.be.null();
        expect(results).to.deep.equal({ test: true });
        done();
      });
    });
  });

  describe('when a request fails', () => {
    it('yields an error', (done) => {
      CarQuery.request('testCommand', 'year', (err) => {
        expect(err.message).to.equal('request error');
        done();
      });
    });
  });

  describe('when the response body contains an error', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 }, { error: 'body error' });
      done();
    });

    it('yields an error', (done) => {
      CarQuery.request('testCommand', 'year', (err) => {
        expect(err.message).to.equal('body error');
        done();
      });
    });
  });

  describe('when validation (reformatting) fails', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 }, { test: true });
      done();
    });

    it('yields an error', (done) => {
      CarQuery.request('testCommand', 'year', (err) => {
        expect(err.message).to.equal('validate error');
        done();
      });
    });
  });

  describe('when the response body is empty', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 });
      done();
    });

    it('yields an error', (done) => {
      CarQuery.request('testCommand', 'year', (err, results) => {
        expect(err).to.be.undefined();
        expect(results).to.be.undefined();
        done();
      });
    });
  });

  describe('when the response body is an empty array', () => {
    beforeEach((done) => {
      Request.get.yields(null, { statusCode: 200 }, []);
      done();
    });

    it('yields an error', (done) => {
      CarQuery.request('testCommand', 'year', (err, results) => {
        expect(err).to.be.undefined();
        expect(results).to.be.undefined();
        done();
      });
    });
  });
});
