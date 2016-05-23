myApp.controller('HomeController', function($scope, $location, UserFactory){
    $scope.login = login;
    $scope.register = register;

    // we can use the uuser factory to get the user who is currently
    // logged in
    UserFactory.getUser().then(function success(response){
      console.log('Got user in the homeController');
      console.log(response);
      $scope.user = response.data;
      $location.path('/users/'+$scope.user._id);
    });

    function login(username, password){
      UserFactory.login(username, password).then(function success(response){
        console.log(response.data)
        $scope.user = response.data.user;
        $location.path('/users/'+$scope.user._id);
        alert(response.data.token);
      }, handleError);
    }

    function register(username, password){
      UserFactory.register(username, password).then(function success(response){
        console.log('in the user fatctoyr');
        console.log(response.data.user);
        $scope.user = response.data.user;
        $location.path('/users/'+$scope.user._id);
        //alert(response.data.token);
      }, handleError);
    }

    function handleError(response){
      alert('Error: ' + response.data);
    }
  }
)
