const {ObjectID} = require('mongodb'); //get ObjectID function

const {mongoose} = require('./../server/db/mongoose'); //load in mongoose
const {Todo} = require('./../server/models/todos'); //load in todos
const {User} = require('./../server/models/user'); //load in user

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findOneAndRemove()
//TOdo.findByIdAndRemove()
// 
// Todo.findByIdAndRemove('5c192c1872c5a38b54be7d26').then((todo) => {
//   console.log(todo);
// });
