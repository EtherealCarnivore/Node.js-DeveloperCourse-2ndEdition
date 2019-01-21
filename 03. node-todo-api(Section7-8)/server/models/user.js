const mongoose = require('mongoose'); //load in mongoose library
const validator = require('validator'); //load in validator library
const jwt = require('jsonwebtoken'); //load in jsonwebtoken
const _ = require('lodash'); //load in lodash
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({ //re-structure to add methods to User model
    email:{
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true, //this prevents users from using the same email to sign up
      validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
  });

//OVERWRITE toJSON method in order to limit data sent back
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); //convert to regular object so we can pick properties

  return _.pick(userObject, ['_id', 'email']); // return only these 2 properties from the API POST Request
  // this way users cannot see passwords, ids or the tokens


};

//create method for User()
UserSchema.methods.generateAuthToken = function () { //generate token for users
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); //sign SHA256 + salt secret

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => { //save changes
    return token;
  });
};

//create method to delete user token once user logs out
UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: { //mongo operator to pull property
        tokens: {token}
    }
  });
};

//create custom find function for User model
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject(); //handle error
  }

  return User.findOne({ //get user by these props
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) { //check if user exists
      return Promise.reject(); //reject to fire catch block
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          resolve(user);
        } else {
          reject();
        }
      })
    })
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
      });
    });
  } else{
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
