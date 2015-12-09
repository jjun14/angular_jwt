(function(){
  'use strict';
  var app = angular.module('app', [], function config($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
  });
  app.constant('API_URL', 'http://localhost:3000');

  app.controller('MainCtrl', function MainCtrl(RandomUserFactory, UserFactory){
    'use strict';
    var vm = this;
    vm.login = login;
    vm.register = register;
    vm.getRandomUser = getRandomUser;
    vm.logout = logout;

    UserFactory.getUser().then(function success(response){
      vm.user = response.data;
    });

    function getRandomUser(){
      RandomUserFactory.getUser().then(function success(response){
        vm.randomUser = response.data;
      });
    }

    function login(username, password){
      UserFactory.login(username, password).then(function success(response){
        vm.user = response.data.user;
        alert(response.data.token);
      }, handleError);
    }

    function register(username, password){
      UserFactory.register(username, password).then(function success(response){
        vm.user = response.data.user;
        alert(response.data.token);
      }, handleError);
    }

    function logout(){
      UserFactory.logout()
      vm.user = null;
    }

    function handleError(response){
      alert('Error: ' + response.data);
    }
  })

  app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL){
    'use strict';
    function getUser(){
      return $http.get(API_URL + '/random-user');
    }
    return {
      getUser: getUser
    };
  });

  app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q){
    'use strict';
    function login(username, password){
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).then(function success(response){
        AuthTokenFactory.setToken(response.data.token);
        return response;
      });
    }
    
    function register(username, password){
      return $http.post(API_URL + '/register', {
        username: username,
        password: password
      }).then(function success(response){
        AuthTokenFactory.setToken(response.data.token);
        return response;
      })

    }

    function logout(){
      AuthTokenFactory.setToken();
    }

    function getUser(){
      if(AuthTokenFactory.getToken()){
        return $http.get(API_URL + '/me');
      } else {
        return $q.reject({ data: 'client has no auth token' });
      }
    }
    return {
      login: login,
      logout: logout,
      getUser: getUser,
      register: register
    };
  });

  app.factory('AuthTokenFactory', function AuthTokenFactory($window){
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';
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

    return {
      getToken: getToken,
      setToken: setToken 
    };
  })
 
  app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory){
    'use strict';
    function addToken(config){
      var token = AuthTokenFactory.getToken();
      if(token){
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
    return {
      request: addToken
    };
  })

})();
