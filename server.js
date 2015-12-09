var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jwtSecret = 'aasjidfjiodsjfiosajfs';
var expressJwt = require('express-jwt');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/login', '/register'] }));

// DB config
require('./server/config/mongoose.js');

// User Controller
var User = mongoose.model('User');
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

app.get('/random-user', function(req, res){
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

app.post('/register', validate, function(req, res){
  var body = req.body;
  var new_user = new User({username: req.body.username, password: createHash(req.body.password)});
  new_user.save()
    .then(function success(user){
      var token = jwt.sign({
        username: user.username
      }, jwtSecret);
      res.send({
        token: token,
        user: user
      });
    })
    .then(function error(err){
      console.log(err);
      res.status(500).end("Internal Server Error");
    })
});

app.post('/login', validate, function(req, res){
    var body = req.body;
    User.findOne({username: req.body.username}).exec()
      .then(function success(user){
        if(body.username !== user.username || !isValidPassword(user, body.password)){
          res.status(401).end("Invalid login credentials");
          return;
        }
        var token = jwt.sign({
          username: user.username
        }, jwtSecret);
        res.send({
          token: token,
          user: user
        });
      })
      .then(null, function error(err){
        console.log(err);
        res.status(500).end("Internal Server Error");
      })
 });

app.get('/me', function(req, res){
  res.send(req.user);
});

app.listen(3000, function(){
  console.log('App listening on localhost:3000')
});

function validate(req, res, next){
  var body = req.body;
  if (!body.username || !body.password) {
     res.status(400).end('Must provide username and password');
  }
//   if(body.username !== user.username || body.password !== user.password){
//     res.status(401).end('Invalid login credentials')
//   }
  next();
}
