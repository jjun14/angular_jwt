(function(){
  'use strict';
  angular
    .module('app')
    .controller('HomeController', HomeController);

  function HomeController($location, UserFactory){
    var vm = this;
    vm.login = login;
    vm.register = register;

    UserFactory.getUser().then(function success(response){
      console.log('Got user in the homeController');
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