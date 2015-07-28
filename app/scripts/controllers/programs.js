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
    $scope.deleteProgram = deleteProgram;

    init();

    function init() {
      getPrograms();
    };

    function getPrograms() {
      ProgramsService.Programs(function(data) {
        $scope.programs = data.programs;
      });
    }

    function deleteProgram(program_id) {
      var response = confirm('Are you sure you want to delete it ?');
      if (!response) { return; }
      ProgramsService.deleteProgram(program_id, function(data, status) {
        if (status === 200) {
          getPrograms();
        } else {
          alert('error');
        }
      });
    };

  }]);
