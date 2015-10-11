'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.factory:AuthenticationService
 * @description
 * # AuthenticationService
 * Factory of the workoutClientApp
 */
angular.module('workoutClientApp')
  .factory('AuthenticationService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope) {
    var service = {};
    service.Login = function(email, password, callback) {
      $http
        .post($rootScope.apiEndpoint+'/api/v1/signin', { email: email, password: password })
        .success(function(data, status) {
          callback(data, status);
        })
        .error(function(data, status) {
          callback(data, status);
        });
    };
    service.SetCredentials = function(user) {
      $rootScope.globals = {
        currentUser: {
          email: user.email,
          name: user.name,
          token: user.token,
          id: user.id
        }
      };
      $cookies.put('globals', JSON.stringify($rootScope.globals));
      $http.defaults.headers.common.Authorization = user.token;
    };
    service.ClearCredentials = function() {
      $rootScope.globals = {};
      $cookies.remove('globals');
      $http.defaults.headers.common.Authorization = '';
    };
    service.Logout = function(callback) {
      $http
        .delete($rootScope.apiEndpoint+'/api/v1/signout')
        .success(function(response, status) {
          callback(response, status);
        })
        .error(function(response, status) {
          callback(response, status);
        });
      this.ClearCredentials();
    };
    service.Signup = function(email, password, confirmPassword, callback) {
      $http
        .post($rootScope.apiEndpoint+'/api/v1/signup', { email: email, password: password, confirmation_password: confirmPassword })
        .success(function(data, status) {
          callback(data, status);
        })
        .error(function(data, status) {
          callback(data, status);
        });
    };
    return service;
  }]);
