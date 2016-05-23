myApp.constant('API_URL', 'http://localhost:3000');

myApp.run(function($rootScope, $location, $route, AuthTokenFactory){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
      if(!AuthTokenFactory.getToken()){
        $location.path('/');
      }
    });
});
