'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ProgramsCtrl
 * @description
 * # ProgramsCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramsCtrl', ['$scope', 'ProgramsService', function ($scope, ProgramsService) {
    ProgramsService.Programs(function(data) {
      $scope.programs = data.programs;
    });
  }]);
