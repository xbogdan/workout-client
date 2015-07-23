'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.factory:Programs
 * @description
 * # Programs
 * Factory of the workoutClientApp
 */
angular.module('workoutClientApp')
  .factory('ProgramsService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
    var service = {};

    service.Programs = Programs;
    service.Program = Program;
    service.editProgram = editProgram;

    return service;

    function Programs(callback) {
      $http({
        method: 'GET',
        url: 'http://localhost:3000/api/v1/programs'
      })
      .success(function(data) {
        callback(data);
      })
      .error(function(err, status) {
         callback(err);
      });
    };

    function Program(id, callback) {
      $http({
        method: 'GET',
        url: 'http://localhost:3000/api/v1/program?id='+id
      })
      .success(function(data) {
        callback(data);
      })
      .error(function(err, status) {
         callback(err);
      });
    };

    function editProgram(program, callback) {
      $http({
        method: 'PUT',
        url: 'http://localhost:3000/api/v1/updateProgram',
        data: {
          program: program
        }
      })
      .success(function(data, status) {
        callback(data);
      })
      .error(function(err, status) {
         callback(err);
      });
    };
}]);
