//connect to DB : mongod --dbpath ~/Desktop/mongo-data
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //pull out properties by de-structuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //open connection to DB
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

// findOneAndUpdate -- http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html
// Mongo DOC - https://docs.mongodb.com/manual/reference/operator/update/
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5c100c33238bc2c36924ccfb')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // EXERCISE: Update a name in the Users collection and use the $inc operator to increment the age property
  // $inc - https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5c0ebc7fcc65b826b3502f33')
  }, {
    $set: {
      name: 'Miri Stormrage'
    },
    $inc: {
      age: +1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // db.close(); // close connection to mongoDB server
});
