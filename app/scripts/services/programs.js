angular.module('workoutClientApp').factory('programs', ['$http', function($http) {
  return $http.get('http://localhost:3000/api/v1/programs')
    .success(function(data) {
      return data;
    })
    .error(function(err) {
      return err;
    });
}]);
