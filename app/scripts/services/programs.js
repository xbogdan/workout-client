angular.module('workoutClientApp')
  .factory('programs', ['$http', '$cookies', function($http, $cookies) {
    var service = {};
    service.Programs = function(callback) {
      // $http.defaults.headers.common.Authorization = $cookies.get('token');
      $http({
        method: 'GET',
        url: 'http://localhost:3000/api/v1/programs',
        headers: {
          'Authorization': $cookies.get('token')
        }
      })
      .success(function(data) {
        callback(data);
      })
      .error(function(err) {
         callback(err);
      });
    }
    return service;
}]);
