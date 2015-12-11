(function(){
  'use strict';
  angular
    .module('app', ['ngRoute'])
    .constant('API_URL', 'http://localhost:3000');
})();


(function(){
  'use strict';
  angular
    .module('app')
    .run(function($rootScope, $location, $route, AuthTokenFactory){
        $rootScope.$on('$routeChangeStart', function(event, next, current){
          if(!AuthTokenFactory.getToken()){
            $location.path('/');
          }
        });
    });
})();

(function(){
  'use strict';
  angular
    .module('app')
    .config(configureRoutes);
  
  function configureRoutes($httpProvider, $routeProvider){
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
      .when('/', {
        controller: 'mainController',
        controllerAs: 'vm',
        templateUrl: '/views/main.html'
      })
      .when('/users/:id', {
          controller: 'UserController',
          controllerAs: 'vm',
          templateUrl: '/views/success.html'
      })
  }
})();

(function(){
  'use strict';
  angular
    .module('app')
    .controller('mainController', mainController);

  function mainController($location, UserFactory){
    var vm = this;
    vm.login = login;
    vm.register = register;

    UserFactory.getUser().then(function success(response){
      console.log('Got user in the mainController');
      console.log(response);
      vm.user = response.data;
      $location.path('/users/'+vm.user._id);
    });


    function login(username, password){
      UserFactory.login(username, password).then(function success(response){
        console.log(response.data)
        vm.user = response.data.user;
        $location.path('/users/'+vm.user._id);
        alert(response.data.token);
      }, handleError);
    }

    function register(username, password){
      UserFactory.register(username, password).then(function success(response){
        console.log('in the user fatctoyr');
        console.log(response.data.user);
        vm.user = response.data.user;
        $location.path('/users/'+vm.user._id);
        //alert(response.data.token);
      }, handleError);
    }

    function handleError(response){
      alert('Error: ' + response.data);
    }
  }
})();

(function(){
  'use_strict';
  angular
    .module('app')
    .controller('UserController', UserController);

  function UserController($location, UserFactory, RandomUserFactory){
    var vm =this;
    vm.getRandomUser = getRandomUser;
    vm.logout = logout;
    
    UserFactory.getUser().then(function success(response){
      console.log('Got user in the UserController');
      console.log(response);
      vm.user = response.data;
    });

    function logout(){
      UserFactory.logout()
      vm.user = null;
      $location.path('/');
    }

    function getRandomUser(){
      RandomUserFactory.getUser().then(function success(response){
        vm.randomUser = response.data;
      });
    }
  }
  
})();

(function(){
  'use strict';
  angular
    .module('app')
    .factory('RandomUserFactory', RandomUserFactory);

  RandomUserFactory.$inject = ['$http', 'API_URL']
  function RandomUserFactory($http, API_URL){
      return {
        getUser: getUser
      };

      function getUser(){
        return $http.get(API_URL + '/random-user');
      }
  }
})();

(function(){
  'use strict';
  angular
    .module('app')
    .factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$http', 'API_URL', 'AuthTokenFactory', '$q'];
  function UserFactory($http, API_URL, AuthTokenFactory, $q){
    var user = null;

    return {
      register: register,
      login: login,
      logout: logout,
      loggedIn, loggedIn,
      getUser: getUser
    };

    function login(username, password){
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).then(function success(response){
        user = response.data.user;
        AuthTokenFactory.setToken(response.data.token);
        return response;
      });
    }
    
    function register(username, password){
      return $http.post(API_URL + '/register', {
        username: username,
        password: password
      }).then(function success(response){
        user = response.data.user;
        AuthTokenFactory.setToken(response.data.token);
        return response;
      })
    }

    function logout(){
      user = null;
      AuthTokenFactory.setToken();
    }

    function loggedIn(){
      if(user){
        return true;
      } else {
        return false;
      }
    }

    function getUser(){
      if(AuthTokenFactory.getToken()){
        return $http.get(API_URL + '/authenticated');
      } else {
        user = null;
        return $q.reject({ data: 'client has no auth token' });
      }
    }
  }
})();

(function(){
  'use strict'
  angular
    .module('app')
    .factory('AuthTokenFactory', AuthTokenFactory);
  
  AuthTokenFactory.$inject = ['$window'];
  function AuthTokenFactory($window){
    var store = $window.localStorage;
    var key = 'auth-token';

    return {
      getToken: getToken,
      setToken: setToken 
    };

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
  }
})();

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
