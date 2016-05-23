myApp.controller('UsersController', function($scope, $location, UserFactory, RandomUserFactory){
    $scope.getRandomUser = getRandomUser;
    $scope.logout = logout;
    
    UserFactory.getUser().then(function success(response){
      console.log('Got user in the UserController');
      console.log(response);
      $scope.user = response.data;
    });

    function logout(){
      UserFactory.logout()
      $scope.user = null;
      $location.path('/');
    }

    function getRandomUser(){
      RandomUserFactory.getUser().then(function success(response){
        $scope.randomUser = response.data;
      });
    }
  }
)
