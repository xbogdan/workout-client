'use strict';

/**
 * @ngdoc overview
 * @name workoutClientApp
 * @description
 * # workoutClientApp
 *
 * Main module of the application.
 */
angular
  .module('workoutClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', '$cookies', '$http', '$location', function ($rootScope, $cookies, $http, $location) {
    // keep user logged in after page refresh
    $rootScope.globals = JSON.parse(String($cookies.get('globals'))) || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/signin' && !$rootScope.globals.currentUser) {
          $location.path('/signin');
        }
    });
  }]);
