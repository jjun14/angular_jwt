(function(){
  'use strict';
  angular
    .module('app')
    .constant('API_URL', 'http://localhost:3000');

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