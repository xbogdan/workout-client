angular.module('workoutClientApp')
  .factory('authentication', ['$http', function($http) {
    var service = {};
    service.Login = function(email, password, callback) {
      $http
        .post('http://localhost:3000/api/v1/signin', { email: email, password: password })
        .success(function(response) {
          callback(response);
        });
    }
    return service;
  }]);
