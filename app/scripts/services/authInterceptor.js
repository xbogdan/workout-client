'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.factory:authInterceptor
 * @description
 * # authInterceptor
 * Factory of the workoutClientApp
 */
angular.module('workoutClientApp')
  .factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($rootScope.globals.currentUser) {
          config.headers.Authorization = $rootScope.globals.currentUser.token;
        }
        return config;
      },
      response: function (response) {
        return response || $q.when(response);
      },
      responseError: function(responseError) {
        if (responseError.status === 401) {
          $rootScope.globals = {};
          $location.path('/signin');
        }
        return responseError || $q.when(responseError);
      }
    };
  }]);
