const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  // Test translation with text and locale fields
  test('Translation with text and locale fields: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({
        text: 'color',
        locale: 'american-to-british'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'color');
        assert.equal(res.body.translation, '<span class="highlight">colour</span>');
        done();
      });
  });

  // Test translation with text and invalid locale field
  test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({
        text: 'color',
        locale: 'invalid-locale'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid value for locale field' });
        done();
      });
  });

  // Test translation with missing text field
  test('Translation with missing text field: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({
        locale: 'american-to-british'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  // Test translation with missing locale field
  test('Translation with missing locale field: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({
        text: 'color'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  // Test translation with empty text
  test('Translation with empty text: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({
        text: '',
        locale: 'american-to-british'
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.deepEqual(res.body, { error: 'No text to translate' });
        done();
      });
  });

  // Test translation with text that needs no translation
  test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
    chai.request(server)
      .post('/api/translate')
      .send({
        text: 'hello',
        locale: 'american-to-british'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'hello');
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
  });

});
