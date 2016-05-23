// this factory grabs data of a 'random' user
// if you try to get this data without being authenticated
// you will get an error
myApp.factory('RandomUserFactory', function($http, API_URL){
      var factory = {};
      factory.getUser = getUser;

      function getUser(){
        return $http.get(API_URL + '/random-user');
      }

      return factory;
  }
);
