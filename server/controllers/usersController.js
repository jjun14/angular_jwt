var faker = require('faker');

module.exports = (function() {
  return {
    randomUser: function(req, res){
      var user = faker.helpers.userCard();
      user.avatar = faker.image.avatar();
      res.json(user);
    }
  }
})();
