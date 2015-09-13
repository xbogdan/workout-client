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
    'ui.tree'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
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
    $rootScope.apiEndpoint = 'http://home.boamfa.com:3000';
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

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/signin' && !$rootScope.globals.currentUser) {
          $location.path('/signin');
        }
    });
  }]);
