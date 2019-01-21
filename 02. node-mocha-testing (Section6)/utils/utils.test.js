// Auto-watch tests:  npm run test-watch

const expect = require('expect') //load in expect

const utils = require('./utils')

// by using describe() we get a better printing structures when the tests are ran
// everything will be grouped up in a section with subsections
//as you can see bellow I have nested describe callbacks into the master one

describe('Utils', () => {
 describe('#add', () => {
   it('should add two numbers', () => {
   var res = utils.add(33, 11);
   });
   it('should async add two numbers', (done) => {
     utils.asyncAdd(4, 3, (sum) => {
       expect(sum).toBe(7).toBeA('number');
       done(); //we need to pass done as callback otherwise the expect compares won't run because of async
     });
   });
   describe('#square', () => {
     it('should square a number', () => {
       var res = utils.square(4);
       expect(res).toBe(16).toBeA('number');
     });
     it('should async square a number', (done) => {
       utils.asyncSquare(4, (sum) => {
         expect(sum).toBe(16).toBeA('number');
         done(); //we need to pass done as callback otherwise the expect compares won't run because of async
       });
     });
   });
   describe('#simple', () => {
     it('should set first and last names are set', () => {
       var user = {location: 'Plovdiv', age: 23};
       var res = utils.setName(user, 'Konstantin Genov');

       // expect(user).toEqual(res);

       expect(res).toInclude({
         firstName: 'Konstantin',
         lastName: 'Genov'
       });
     })

   });
   });
 });
