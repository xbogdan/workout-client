'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('LoginCtrl', ['$scope', '$cookies', 'AuthenticationService', '$location', '$rootScope', function ($scope, $cookies, AuthenticationService, $location, $rootScope) {

    // Redirect to / if user is signed in
    if ($rootScope.globals.currentUser) {
      $location.path('/');
    }

    // Action for the login form
    $scope.login = function() {
      AuthenticationService.ClearCredentials();
      AuthenticationService.Login($scope.email, $scope.password, function(data, status) {
        if (status === 200) {
          AuthenticationService.SetCredentials({
            email: data.email,
            name: data.name,
            token: data.auth_token
          });
          $location.path('/');
        } else if (status === 401) {
          alert('Login Failed');
        } else {
          alert(data + 'Error. Status: ' + status + 'received. Please try again later.');
        }
      });
    };
  }]);
