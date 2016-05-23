myApp.factory('AuthInterceptor', function (AuthTokenFactory){
    var factory = {};
    factory.request = addToken;

    function addToken(config){
      var token = AuthTokenFactory.getToken();
      if(token){
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }

    return factory
  }
);
