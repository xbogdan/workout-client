'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ProgramsCtrl
 * @description
 * # ProgramsCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('TracksController', ['$scope', 'TracksService', function ($scope, TracksService) {
    $scope.deleteTrack = deleteTrack;

    init();

    function init() {
      getTracks();
    }

    function getTracks() {
      TracksService.Tracks(function(data) {
        $scope.tracks = data.tracks;
      });
    }

    function deleteTrack(program_id) {
      var response = confirm('Are you sure you want to delete it ?');
      if (!response) { return; }
      TracksService.deleteTrack(program_id, function(data, status) {
        if (status === 200) {
          getTracks();
        } else {
          alert('error');
        }
      });
    }
  }]);
