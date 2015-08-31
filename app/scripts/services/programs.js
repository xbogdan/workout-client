'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.factory:ProgramsService
 * @description
 * # ProgramsService
 * Factory of the workoutClientApp
 */
angular.module('workoutClientApp')
  .factory('ProgramsService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
    var service = {};

    service.Programs = Programs;
    service.Program = Program;
    service.editProgram = editProgram;
    service.createProgram = createProgram;
    service.deleteProgram = deleteProgram;
    service.Exercises = Exercises;

    return service;

    function Programs(callback) {
      $http({
        method: 'GET',
        url: $rootScope.apiEndpoint+'/api/v1/programs'
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    };

    function Program(id, callback) {
      $http({
        method: 'GET',
        url: $rootScope.apiEndpoint+'/api/v1/program?id='+id
      })
      .success(function(data, status) {
        callback(data, status);
      })
      .error(function(err, status) {
         callback(err, status);
      });
    };

    function createProgram(program, callback) {
      $http({
        method: 'POST',
        url: $rootScope.apiEndpoint+'/api/v1/createProgram',
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
    };

    function editProgram(program, callback) {
      $http({
        method: 'PUT',
        url: $rootScope.apiEndpoint+'/api/v1/updateProgram',
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
    };

    function deleteProgram(program_id, callback) {
      $http({
        method: 'DELETE',
        url: $rootScope.apiEndpoint+'/api/v1/deleteProgram',
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
    };

    function Exercises(filter, callback) {
      $http({
        method: 'GET',
        url: $rootScope.apiEndpoint+'/api/v1/exercises?filter='+filter
      })
      .success(function(data, status) {
        callback(data);
      })
      .error(function(err, status) {
         callback(err);
      });
    };
}]);
