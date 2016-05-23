var mongoose = require('mongoose');
var User = mongoose.model('User');
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

module.exports = (function(req, res){
  return {
    register: function(req, res){
      var body = req.body;

      if(!body.username || !body.password){
        res.status(400).end('Must provide user name and password');
      }

      // we prevent XSS by filtering the data
      var filteredUsername = xssFilters.inHTMLData(body.username);
      var filteredPassword = xssFilters.inHTMLData(body.password);
      // create a user and use bCrypt to hash the password
      var new_user = new User({username: filteredUsername, password: createHash(filteredPassword)});
      new_user.save()
        .then(function success(user){
          // if the user saves successfully we will create a jwt
          var token = jwt.sign(
              {
                _id: user._id,
                username: user.username
              },
              jwtSecret,
              {expiresIn: 86400} 
          );
          // and send that token back to the client
          res.send({
            token: token,
            user: {_id: user._id, username:user.username, logged_in: true}
          });
        })
        .then(function error(err){
          console.log(err);
          res.status(500).end("Internal Server Error");
        })
    },
    login: function(req, res){
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
    },
    authenticated: function(req, res){
      var user = req.user;
      user.logged_in = true;
      console.log(user);
      res.send(user);
    }
  }
})();
