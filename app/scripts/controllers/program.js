'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramCtrl', ['$scope', '$routeParams', 'programs', function ($scope, $routeParams, programs) {
    // Action for the login form
    programs.Program($routeParams.id, function(data) {
      $scope.program = data.program;
    });
  }]);
