'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('LoginCtrl', ['$scope', '$cookies', 'AuthenticationService', function ($scope, $cookies, AuthenticationService) {
    var self = this;
    $scope.login = function() {
      AuthenticationService.ClearCredentials();
      AuthenticationService.Login($scope.email, $scope.password, function(data, status) {
        if (status == 200) {
          AuthenticationService.SetCredentials({
            email: data.email,
            name: data.name,
            token: data.auth_token
          });
        } else {
          alert(data.error);
        }
      });
    };
  }]);
