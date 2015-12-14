(function(){
  'use strict';
  angular
    .module('app')
    .factory('AuthInterceptor', AuthInterceptor);
  
  AuthInterceptor.$inject = ['AuthTokenFactory'];

  function AuthInterceptor(AuthTokenFactory){
    return {
      request: addToken
    };

    function addToken(config){
      var token = AuthTokenFactory.getToken();
      if(token){
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
})();