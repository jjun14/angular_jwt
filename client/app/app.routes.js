(function(){
  'use strict';
  angular
    .module('app')
    .config(configureRoutes);
  
  function configureRoutes($httpProvider, $routeProvider){
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
      .when('/', {
        controller: 'HomeController',
        controllerAs: 'vm',
        templateUrl: '/partials/home.html'
      })
      .when('/users/:id', {
          controller: 'UsersController',
          controllerAs: 'vm',
          templateUrl: '/partials/users.html'
      })
  }
})();