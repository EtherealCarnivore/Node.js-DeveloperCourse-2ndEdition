//connect to DB : mongod --dbpath ~/Desktop/mongo-data
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //pull out properties by de-structuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //open connection to DB
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany -- delete all documents with specified property
  db.collection('Todos').deleteMany({text: 'Become a Maiev god'})
  .then((result) => {
  console.log(result);
  });

  // deleteOne -- delete specific document with property
  db.collection('Todos').deleteOne({text: 'Maiev'})
  .then((result) => {
    console.log(result);
  });

  // findOneAndDelete -- find one document with property and delete
  db.collection('Todos').findOneAndDelete({completed: false})
  .then((result) => {
    console.log(result); //return deleted document + value
  });

  // EXERCISE (2 parts):
  // Part 1: Delete all documents with specified property
  db.collection('Users').deleteMany({name: 'Koce'})
  .then((result) => {
    console.log(result);
  });

  // Part 2: Delete one document with it's db ID
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("5c0ebdd7637203273ebf63b0")
  }).then((result) => {
    console.log(result);
  });

  // db.close(); // close connection to mongoDB server
});
