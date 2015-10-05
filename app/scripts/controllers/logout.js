'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:LogoutController
 * @description
 * # LogoutController
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('LogoutController', ['$scope', '$cookies', 'AuthenticationService', '$location', function ($scope, $cookies, AuthenticationService, $location) {
    AuthenticationService.Logout(function(data, status) {
      if (status !== 204) {
        alert('Failed to signout');
      }
      $location.path('/signin');
    });
  }]);
