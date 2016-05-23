myApp.factory('RandomUserFactory', function($http, API_URL){
      var factory = {};
      factory.getUser = getUser;

      function getUser(){
        return $http.get(API_URL + '/random-user');
      }

      return factory;
  }
);
