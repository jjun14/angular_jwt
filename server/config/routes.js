var auth = require('../controllers/authController');
var users = require('../controllers/usersController');

module.exports = function(app){
  app.post('/register', function(req, res){
    auth.register(req, res);
  });

  app.post('/login', function(req, res){
    auth.login(req, res);
  });

  app.get('/authenticated', function(req, res){
    auth.authenticated(req, res);
  });

  app.get('/random-user', function(req, res){
    users.randomUser(req, res);
  });

}
