'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:MenuController
 * @description
 * # MenuController
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('MenuController', ['$scope', '$cookies', 'AuthenticationService', '$location', '$rootScope', function ($scope, $cookies, AuthenticationService, $location, $rootScope) {
    $scope.loggedIn = false;
    $rootScope.$watch('globals.currentUser', function(newVal, oldVal) {
      if (typeof newVal === 'object') {
        $scope.loggedIn = true;
      } else {
        $scope.loggedIn = false;
      }
    });
  }]);
