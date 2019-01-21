// Testing the server requests in here
// ! Custom script is set up to run nodemon this file -- npm run test-watch

const expect = require('expect'); //load in expect
const request = require('supertest'); //load in supertest
const {ObjectID} = require('mongodb');

// request.agent(app.listen()); //prevent double listening on port 3000

const {Todo} = require('./../models/todos');
const {User} = require('./../models/user');
const {app} = require('./../server'); //require local vars
const {todos, populateTodos, users, populateUsers} = require('./seed/seed') //grab functions

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) =>{
    var text = 'Test todo text';

    request(app)
        .post('/todos') // POST
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(201) //check if status code 201
    .expect((res) => {
      expect(res.body.text).toBe(text); // text === text
    })
    .end((err, res) => {
      if (err) {
        return done(err); //if error end function and print, below code will not execute
      }
        //CHECK if DB is correct
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1); //I've added 1 todo, so the length is 1
        expect(todos[0].text).toBe(text); //check if text === text
        done(); //finish test case -- ^ if either of these fail the test will pass
      }).catch((e) => done(e)); //^ this will get any error that might occur inside callback
    });
  });

    // TEST FOR INVALID DATA
  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos') // POST
    .set('x-auth', users[0].tokens[0].token)
    .send({})
    .expect(400) //check if status code 400
    .end((err, res) => {
      if (err) {
        return done(err); //if error end function and print, below code will not execute
      }
        //CHECK if DB is correct
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e)); //^ this will get any error that might occur inside callback
    });
  });
  });

    // TEST GET /todos
  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();

      request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    });

    it('should return 404 for non object IDS', (done) => {
      request(app)
      .get('/todos/123absav')
      .expect(404)
      .end(done);
    })
  });

  //DELETE /todos/:id route Testing

  describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
          var hexId = todos[1]._id.toHexString();

      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    });

    it('should return 404 if objectID is invalid', (done) => {
      request(app)
      .delete('/todos/123absav') //invalid ID
      .expect(404)
      .end(done);
    });
  });

 // PATCH /todos/:id route
 // EXERCISE :
 // PART 1: grab id of 1st item
   // update text, set completed === true
   // 200
   //res.body - text == text, completed is true, completedAt is a number .toBeA
   // --------
   // PART 2: grab id of 2nd item
         // update text, set completed to false
         // 200
         // res.body: text is changed, completed is false, completedAt is null .toNotExist
     var hexId = todos[0]._id.toHexString(); //id of first todo
  describe('PATCH /todos/:id route', () => {
    it('should update the todo', (done) => {
      var text = "Testing update";

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
          completed: true,
          text
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text) // text === text
          expect(res.body.todo.completed).toBe(true)
          expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
      var hexId = todos[1]._id.toHexString(); //id of second todo
      var text = "Testing update 2";

      request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text) //check if text changed
        expect(res.body.todo.completed).toBe(false) //completed false
        expect(res.body.todo.completedAt).toNotExist() //At null
      })
      .end(done);
    });
  });

  //TEST GET users/me route
  describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
    });
  });

  // TEST for signup route
  describe('POST /users', () => {
    it('should create a user', (done) => {
      var email = 'abathur@example.com';
      var password = '123mnb!';

      request(app)
      .post('/users')
      .send({email, password}) //send signup data
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist(); //expect header
        expect(res.body._id).toExist(); //check if id was created
        expect(res.body.email).toBe(email); //check if email was created
      })
      .end((err) => {
        if (err){
          return done(err); //handle error
        }
        User.findOne({email}).then((user) => { //query db
          expect(user).toExist(); //check if user was created
          expect(user.password).toNotBe(password); //check if the password was hashed+salted
          done();//end
        }).catch((e) => done(e));
      });
    });

    it('should return validation errors if request invalid', (done) => {
      var email = 'invalidemail';
      var password = 'inval';

      request(app)
      .post('/users')
      .send({email, password}) //send invalid email and pass
      .expect(400) //expect fail
      .end(done)
    });

    it('should not create user if email in use', (done) => {
      var existingEmail = 'maiev@example.com'; //send existing email from DB
      var password = '123abc!@'; //send valid password

      request(app)
      .post('/users')
      .send({existingEmail, password}) //send signup data
      .expect(400) //expect to fail due to duplicate emails
      .end(done)
    });
  });

  // TEST Post /users/login route
  describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist //check response headers for x-auth token
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => res.send(e));
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + 'random232'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist //header should not send token
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0); //array should be empty
        done();
      }).catch((e) => done(e));
    });
});
});

// TEST delete route
describe('Delete /users/me/token', () => {
  it('should remove auth token on log out', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token) //send seeded token
    .expect(200) //expect 200 if deletion is successfull
    .end((err, res) => {
      if (err) { //eror handling
        return done(err);
      } //query DB for user and check array
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0); //aray should be empty
        done();
      }).catch((e) => done(e));
    });
  });
});
