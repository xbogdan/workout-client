'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ProgramsCtrl
 * @description
 * # ProgramsCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramsCtrl', ['$scope', 'programs', function ($scope, programs) {
    programs.Programs(function(data) {
      $scope.programs = data.programs;
    });
    $scope.ceva = 'ceva';
  }]);
