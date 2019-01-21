const {ObjectID} = require('mongodb'); //get ObjectID function
const {mongoose} = require('./../server/db/mongoose'); //load in mongoose
const {Todo} = require('./../server/models/todos'); //load in todos
const {User} = require('./../server/models/user'); //load in user


var id = '5c13de9733bcbe9c0c8bff7b1'; //first object ID in Todos

if (!ObjectID.isValid(id)) {
  console.log(`ID not valid`);
};

Todo.find({
  _id: id //mongoose will convert the string to an ObjectID and will run the query
}).then((todos) => {
  console.log('Find todos by id -- prints array');
  console.log(JSON.stringify(todos, undefined, 2));
});

Todo.findOne({
  _id: id //mongoose will convert the string to an ObjectID and will run the query
}).then((todo) => {
  console.log('Find one todo -- prints single object');
  console.log(JSON.stringify(todo, undefined, 2));
});

Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log(`Id: ${id} not found`);
  }
  console.log('Find one todo by ID -- prints single object');
  console.log(JSON.stringify(todo, undefined, 2));
}).catch((e) => console.log(e)); //catch && print error

// EXERCISE: Find user by ID -- handle 3 cases, found user, not found and handle other errors

var userId = '5c115a693ede59e013ea9238';

User.findById(userId).then((user) => { //query user by ID
  if (!user) {
    return console.log('User not found'); //handle error
  }
  console.log(`Find user by id: ${userId}`); //print
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e)); //catch && log
