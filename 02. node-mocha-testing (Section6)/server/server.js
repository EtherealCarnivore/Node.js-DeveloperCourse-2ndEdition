const express = require('express'); //load in express

var app = express();

app.get('/', (req, res) => {
res.status(404).send({
  error: 'Page not found.',
  name: 'Todo App v1.0'
});
});

// GET /users
// Exercise: give users a name prop and age prop

app.get('/users', (req, res) =>{
res.status(200).send([{
  name: 'Koce',
  age: 23
},
{
  name: 'Nikola',
  age: 22
},
{
  name: 'Mirela',
  age: 23
}
])
});

app.listen(3000);
module.exports.app = app;
