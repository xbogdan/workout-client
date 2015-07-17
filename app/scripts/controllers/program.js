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
    $scope.toggleEdit = function() {
      $scope.editing = !$scope.editing;
      $scope.master = $scope.program;
    }
    if ($routeParams.id) {
      $scope.showEditButton = true;
      programs.Program($routeParams.id, function(data) {
        $scope.program = data.program;
      });
    } else {
      $scope.editing = true;
      $scope.showEditButton = false;
      $scope.master = {};
    }
  }]);
