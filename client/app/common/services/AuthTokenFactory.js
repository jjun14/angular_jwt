 // this factory handles our token on the client
 // when a user logs in successfully this factory
 // will store our token in localStorage
myApp.factory('AuthTokenFactory', function($window){
    var factory = {};
    var store = $window.localStorage;
    var key = 'auth-token';

    factory.getToken = getToken;
    factory.setToken = setToken;

    function getToken(){
      return store.getItem(key);
    }

    function setToken(token){
      if(token){
        store.setItem(key, token);
      } else {
        store.removeItem(key);
      }
    }

    return factory;
  }
);
