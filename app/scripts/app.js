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
    'ngTouch',
    'ui.tree',
    'ui.bootstrap'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/', {
        templateUrl: 'views/programs.html',
        controller: 'ProgramsCtrl',
        controllerAs: 'programs'
      })
      .when('/program/:id', {
        templateUrl: 'views/program.html',
        controller: 'ProgramCtrl',
        controllerAs: 'program'
      })
      .when('/new', {
        templateUrl: 'views/new-program.html',
        controller: 'ProgramCtrl',
        controllerAs: 'newProgram'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/signout', {
        template: ' ',
        controller: 'LogoutCtrl'
      })
      .when('/tracks', {
        templateUrl: 'views/tracks.html',
        controller: 'TracksController',
        controllerAs: 'tracks'
      })
      .when('/track/new', {
        templateUrl: 'views/new-track.html',
        controller: 'TrackController',
        controllerAs: 'newTrack'
      })
      .when('/track/:id', {
        templateUrl: 'views/track.html',
        controller: 'TrackController',
        controllerAs: 'track'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', '$cookies', '$http', '$location', function ($rootScope, $cookies, $http, $location) {
    $rootScope.apiEndpoint = 'http://localhost:3000'; 
    // keep user logged in after page refresh
    var globals = $cookies.get('globals') || null;
    if (globals) {
      $rootScope.globals = JSON.parse(String(globals));
      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common.Authorization = $rootScope.globals.currentUser.token;
      }
    } else {
      $rootScope.globals = {};
    }

    $rootScope.$on('$locationChangeStart', function () {
        // redirect to login page if not logged in
        if ($location.path() !== '/signin' && !$rootScope.globals.currentUser) {
          $location.path('/signin');
        }
    });
  }]);
