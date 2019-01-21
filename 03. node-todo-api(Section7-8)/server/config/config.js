var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000; //set up port for local use
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'; //set to local TODO DB
}else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest' //set to local TODO test DB
}
