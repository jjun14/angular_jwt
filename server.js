var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwtSecret = 'aasjidfjiodsjfiosajfs';
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');

var app = express();
app.use(express.static(path.join(__dirname, './client')));
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret })
          .unless({ path: ['/', '/login', '/register', '/favicon.ico'] }));

// DB config
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

app.listen(3000, function(){
  console.log('App listening on localhost:3000')
});

