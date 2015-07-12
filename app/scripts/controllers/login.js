'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('LoginCtrl', ['$scope', '$cookies', 'authentication', function ($scope, $cookies, authentication) {
    var self = this;
    $scope.login = function() {
      authentication.Login($scope.email, $scope.password, function(data) {
        $cookies.put('token', data.token);
        $cookies.put('user', data.email);
        console.log($cookies.get('token'));
      });
    };
  }]);
