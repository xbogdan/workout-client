'use strict';

angular.module('workoutClientApp')
  .directive('routineDay', [function () {
    return {
      restrict: 'EA',
      scope: false,
      replace: true,
      templateUrl: 'views/templates/program-day.html'
    };
  }]);

angular.module('workoutClientApp')
  .directive('routineExercise', [function () {
    return {
      restrict: 'EA',
      scope: false,
      replace: true,
      templateUrl: 'views/templates/program-exercise.html'
    };
  }]);

angular.module('workoutClientApp')
  .directive('routineSet', [function () {
    return {
      restrict: 'EA',
      scope: false,
      replace: true,
      templateUrl: 'views/templates/program-set.html'
    };
  }]);
