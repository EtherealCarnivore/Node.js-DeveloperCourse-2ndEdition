var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', { //we need to create a model for our application
  text: {
    type: String, //specify the types for the properties
    required: true,
    minlength: 1,
    trim: true

  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true //setting this property allows us to distinguish between users and limit their access to todos || only user with this said
    // ID can get and create todos for his account and not access ones made by other users

  }
});

module.exports = {Todo};
