'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('MainCtrl', ['$scope', 'programs', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    programs.success(function(data) {
      $scope.programs = data;
    });
  }]);
