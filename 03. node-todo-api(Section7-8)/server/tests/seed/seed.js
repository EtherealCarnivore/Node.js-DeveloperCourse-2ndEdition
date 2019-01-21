const {ObjectID} = require('mongodb'); //load in ObjectID
const jwt = require('jsonwebtoken'); //load in jwt to sign token

const {Todo} = require('./../../models/todos'); //load in model
const {User} = require('./../../models/user'); //load in user model


const userOneId = new ObjectID();
const userTWoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'email@example.com',
  password: 'userOnePass',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access:'auth'}, 'abc123').toString()
  }]
},{
  _id: userTWoId,
  email: 'maiev@example.com',
  password: 'userTwoPass',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userTWoId, access:'auth'}, 'abc123').toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId,
  completed: true,
  completedAt: null
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  _creator: userTWoId,
  completed:true,
  completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save(); //by calling save the middleware will run and hash the password
    var userTwo = new User(users[1]).save();

    Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
