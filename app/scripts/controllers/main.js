'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('MainCtrl', ['$scope', 'programs', function ($scope, programs) {
    programs.Programs(function(data) {
      $scope.programs = data.programs;
    });
    $scope.ceva = 'ceva';
  }]);
