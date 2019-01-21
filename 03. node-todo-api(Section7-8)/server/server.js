//!! To run nodemon with the server.js file type npm run test-watch (custom script inside package.json)
require('./config/config');

const _ = require('lodash'); //loadin lodash
const express = require('express'); //load in express
const bodyParser = require('body-parser'); //load in body-parser
const {ObjectID} = require('mongodb'); //get ObjectID function

//load in local files
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT //set up port for Heroku

var app = express(); //innit express

app.use(bodyParser()); //load in middleware

// REQUEST: POST /todos - changed to private
app.post('/todos', authenticate, (req, res) => {
 var todo = new Todo({
   text: req.body.text,
     _creator: req.user._id
 });
 todo.save().then((saved) => {
   res.status(201).send(saved); //201 created
 }, (e) => {
   res.status(400).send(e); //400 bad request
 });
});

// REQUEST: GET /todos - changed to private
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
      _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e); //if error send bad request
  })
});

// REQUEST: GET /todos/id -- dynamic
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

    if (!ObjectID.isValid(id)) { //check for valid mongodb ID
      return res.status(404).send(); //send bad request response
    };

    Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send(); //if todo doesn't exist respond with 404
      };
      res.status(200).send({todo}); //if success send todo body
    }).catch((e) => res.status(400).send()); //handle error, respond with 400
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  //validate ID -> not valid? return 404

  if (!ObjectID.isValid(id)) { //check if ID is valid
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){ // no todo found
      return res.status(404).send();
    };
    res.status(200).send({todo}); //success case
  }).catch((e) => {
     res.status(400).send();
   });
 });

 // HTTP PATCH route

 app.patch('/todos/:id', (req,res) => {
   var id = req.params.id; //get objectID from request
   var body = _.pick(req.body, ['text', 'completed']); //pull off specific properties -- we dont want users updating others or adding new ones not specified in the mongo model

   if (!ObjectID.isValid(id)) { //check if ID is valid
     return res.status(404).send();
   }

   if (_.isBoolean(body.completed) && body.completed) { //check if the completed property was set to true
     body.completedAt = new Date().getTime();
   } else { // if it wasn't completed
     body.comepleted = false;
     body.completedAt = null; //remove timestamp
   }

   Todo.findByIdAndUpdate(id, {$set:body}, {new: true})
   .then((todo) => {
     if(!todo){ //document not found
       return res.status(404).send(); //respond with 404
     }
     res.send({todo}); //success -- send back object
   }).catch((e) => {
     res.status(400).send(); //send bad request on error
   })
 });

 // POST /users
 app.post('/users', (req, res) => {
   var body = _.pick(req.body, ['email', 'password']);
   var user = new User(body);

   user.save().then(() => {
     return user.generateAuthToken();
   }).then((token) => {
     res.header('x-auth', token).send(user);
   }).catch((e) => {
     res.status(400).send(e);
   })
 });

// PRIVATE GET route
 app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
 });

 // POST /users/login {email, password}
 app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) =>{
  return user.generateAuthToken().then((token) => { //generate new token for user
  res.header('x-auth', token).send(user); //respond with header and user body

  });
  }).catch((e) => {
    res.status(400).send(); //send 400
  });
 });

// DELETE route - remove token after user logs out
 app.delete('/users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
     res.status(200).send();
   }, () => {
     res.status(400).send();
   })
 });


app.listen(port, () => { //listens to port - works locally && Heroku
  console.log(`Server is up on port ${port}`);
});

module.exports = {app}; //export the app so it can be used in other files
