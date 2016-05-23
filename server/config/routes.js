var mongoose = require('mongoose');
var User = mongoose.model('User');
var faker = require('faker');
var jwt = require('jsonwebtoken');
var jwtSecret = 'aasjidfjiodsjfiosajfs';
var bCrypt = require('bcrypt-nodejs');
var xssFilters = require('xss-filters');

// using bcrypt to create a password hash
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

// using bcrypt to check passwords at login
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

function validate(req, res,next){
  var body = req.body;
}

module.exports = function(app){
  app.post('/register', function(req, res){
    var body = req.body;

    if(!body.username || !body.password){
      res.status(400).end('Must provide user name and password');
    }

    var filteredUsername = xssFilters.inHTMLData(body.username);
    var filteredPassword = xssFilters.inHTMLData(body.password);
    var new_user = new User({username: filteredUsername, password: createHash(filteredPassword)});
    new_user.save()
      .then(function success(user){
        var token = jwt.sign(
            {
              _id: user._id,
              username: user.username
            },
            jwtSecret,
            {expiresIn: 86400} 
        );
        res.send({
          token: token,
          user: {_id: user._id, username:user.username, logged_in: true}
        });
      })
      .then(function error(err){
        console.log(err);
        res.status(500).end("Internal Server Error");
      })
  });

  app.post('/login', function(req, res){
      var body = req.body;
      var filteredUsername = xssFilters.inHTMLData(body.username);
      User.findOne({username: filteredUsername}).exec()
        .then(function success(user){
          if(body.username !== user.username || !isValidPassword(user, body.password)){
            res.status(401).end("Invalid login credentials");
            return;
          }
          var token = jwt.sign({
            _id: user._id,
            username: user.username
          }, jwtSecret);
          res.send({
            token: token,
            user: {_id: user._id, username:user.username, logged_in: true}
          });
        })
        .then(null, function error(err){
          console.log(err);
          res.status(500).end("Internal Server Error");
        })
  });

  app.get('/authenticated', function(req, res){
    var user = req.user;
    user.logged_in = true;
    console.log(user);
    res.send(user);
  });

  app.get('/random-user', function(req, res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
  });

}
