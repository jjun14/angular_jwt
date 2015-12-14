(function(){
  'use_strict';
  angular
    .module('app')
    .controller('UsersController', UsersController);

  function UsersController($location, UserFactory, RandomUserFactory){
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