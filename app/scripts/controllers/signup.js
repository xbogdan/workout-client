'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:SignupController
 * @description
 * # SignupController
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('SignupController', ['$scope', '$cookies', 'AuthenticationService', '$location', '$rootScope', function ($scope, $cookies, AuthenticationService, $location, $rootScope) {

    // Redirect to if user is signed in
    if ($rootScope.globals.currentUser) {
      $location.path('/');
    }

    $scope.email = '';
    $scope.password = '';
    $scope.confirmPassword = '';

    $scope.$watch('email', function(newVal, oldVal) {
      if (newVal.length) {
        $('#email').closest('.form-group').removeClass('has-error');
      }
    });

    $scope.$watch('confirmPassword', function(newVal, oldVal) {
      if (newVal.length) {
        $('#confirm-password').closest('.form-group').removeClass('has-error');
      }
    });

    $scope.$watch('password', function(newVal, oldVal) {
      if (newVal.length) {
        $('#password').closest('.form-group').removeClass('has-error');
      }
    });

    function validate() {
      var valid = true;
      if (!$scope.email.length) {
        $('#email').closest('.form-group').addClass('has-error');
        valid = false;
      }
      if (!$scope.password.length) {
        $('#password').closest('.form-group').addClass('has-error');
        valid = false;
      }

      if (!$scope.confirmPassword.length) {
        $('#confirm-password').closest('.form-group').addClass('has-error');
        valid = false;
      }

      if ($scope.password !== $scope.confirmPassword) {
        $('#confirm-password').closest('.form-group').addClass('has-error');
        $('#password').closest('.form-group').addClass('has-error');
        valid = false;
      }

      return valid;
    }

    $scope.register = function() {
      if (validate()) {
        AuthenticationService.Signup($scope.email, $scope.password, $scope.confirmPassword, function(data, status) {
          if (status === 201) {
            AuthenticationService.SetCredentials({
              email: data.email,
              name: data.name,
              token: data.auth_token
            });
            $location.path('/');
          } else {
            alert('Failed to register. Please try again');
          }
        });
      }
    };

  }]);
