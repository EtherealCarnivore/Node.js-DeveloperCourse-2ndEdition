const request = require('supertest'); //load in supertest
const expect = require('expect');

var app = require('./server').app; //load in the server

// by using describe() we get a better printing structures when the tests are ran
// everything will be grouped up in a section with subsections
//as you can see bellow I have nested describe callbacks into the master one

describe('Server', () => {
  describe('#/home', () =>{
    it('should return hello world response', (done) => {
    request(app)
      .get('/')
      .expect(404)
      .expect((res) => {
        expect(res.body).toInclude({
          error: 'Page not found.'
        });
      })
      .end(done)
    });
  });
  describe('/users', () => {
    it('should return users array with my name included', done =>{
      request(app)
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toInclude({
          name: 'Koce',
          age: 23
        });
      })
      .end(done)
    });
  });
});
