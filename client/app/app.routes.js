myApp.config(function($httpProvider, $routeProvider){
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: '/partials/home.html'
    })
    .when('/users/:id', {
        controller: 'UsersController',
        templateUrl: '/partials/users.html'
    })
});
