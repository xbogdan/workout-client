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
    $scope.toggleEdit = toggleEdit;
    $scope.submit = submit;

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

    function toggleEdit(updated) {
      $scope.editing = !$scope.editing;
      $scope.master = $scope.program;
      $scope.masterCopy = angular.copy($scope.master);
      if (!updated) {
        $scope.master = angular.copy($scope.masterCopy);
      }
    };
    function submit() {
      if ($routeParams.id) {
        programs.editProgram($scope.master, function(data) {
          $scope.program = $scope.master;
          $scope.toggleEdit(true);
        });
      } else {
        // programs

      }
    };
  }]);
