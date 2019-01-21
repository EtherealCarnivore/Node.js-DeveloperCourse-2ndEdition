//connect to DB : mongod --dbpath ~/Desktop/mongo-data
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //open connection to DB
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID("5c10033a238bc2c36924cb1f") //search for the exact object with said ID
  // }).toArray()
  //   .then((docs) => { //fetch collection
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count()
  //   .then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name: 'Koce'}) //find all records for the name and exclude others
  .toArray()
  .then((names) => { //fetch from collection
    console.log('Users');
    console.log(JSON.stringify(names, undefined, 2)); //JSON to string
  }, (err) => {
    console.log('Unable to fetch users');
  });

  // db.close();
});
