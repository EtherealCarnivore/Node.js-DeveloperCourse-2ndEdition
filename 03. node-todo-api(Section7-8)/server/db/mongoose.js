var mongoose = require('mongoose'); //load in mongoose

mongoose.Promise = global.Promise; //set mongoose promises to node.js built in ones
mongoose.connect(process.env.MONGODB_URI); //connect to mongoDB server

module.exports = {mongoose};
