myApp.factory('UserFactory', function($http, API_URL, AuthTokenFactory, $q){
    var user = null;
    var factory = {};
    factory.register = register;
    factory.login = login;
    factory.logout = logout;
    factory.loggedIn = loggedIn;
    factory.getUser =  getUser;

    return factory;

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
);
