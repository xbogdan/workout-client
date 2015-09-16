'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.factory:TracksService
 * @description
 * # TracksService
 * Factory of the workoutClientApp
 */
angular.module('workoutClientApp')
  .factory('TracksService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
    var service = {};
    service.Tracks = Tracks;
    service.Track = Track;
    service.editTrack = editTrack;
    service.createTrack = createTrack;
    service.deleteTrack = deleteTrack;

    return service;

    function Tracks(callback) {
      $http({
        method: 'GET',
        url: $rootScope.apiEndpoint+'/api/v1/tracks'
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    }

    function Track(id, callback) {
      $http({
        method: 'GET',
        url: $rootScope.apiEndpoint+'/api/v1/track?id='+id
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    }

    function createTrack(program, callback) {
      $http({
        method: 'POST',
        url: $rootScope.apiEndpoint+'/api/v1/createTrack',
        data: {
          program: program
        }
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    }

    function editTrack(program, callback) {
      $http({
        method: 'PUT',
        url: $rootScope.apiEndpoint+'/api/v1/updateTrack',
        data: {
          program: program
        }
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    }

    function deleteTrack(program_id, callback) {
      $http({
        method: 'DELETE',
        url: $rootScope.apiEndpoint+'/api/v1/deleteTrack',
        data: {
          id: program_id
        }
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    }
  }]);
