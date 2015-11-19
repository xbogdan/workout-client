'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.factory:ProgramsService
 * @description
 * # ProgramsService
 * Factory of the workoutClientApp
 */
angular.module('workoutClientApp')
  .factory('RoutineListService', ['$http', '$cookies', '$rootScope', 'ProgramsService', function($http, $cookies, $rootScope, ProgramsService) {
    var service = {};

    service.scope = null;
    service.init = function(scope) {
      service.scope = scope;
    };

    service.addDay = function() {
      if (typeof $scope.master.track_days_attributes === 'undefined') {
        $scope.master.track_days_attributes = [];
      }
      var dayIndex = $scope.master.track_days_attributes.length;
      var date = new Date();
      $scope.master.track_days_attributes.push({ date: date.toISOString(), track_day_exercises_attributes: [] });
      if (dayIndex > 0) {
        $scope.master.track_days_attributes[dayIndex].ord = $scope.master.track_days_attributes[dayIndex-1].ord + 1;
      }
      $scope.newIndexes.track_days_attributes.push(dayIndex);
      addExercise($scope.master.track_days_attributes[dayIndex]);
    };

    service.addExercise = function(day) {
      var exIndex = day.track_day_exercises_attributes.length;
      day.track_day_exercises_attributes.push({ name: 'Pick an exercise.', ord: 0, track_day_exercise_sets_attributes: [] });
      if (exIndex > 0) {
        day.track_day_exercises_attributes[exIndex].ord = day.track_day_exercises_attributes[exIndex-1].ord + 1;
      }
      $scope.newIndexes.track_day_exercises_attributes.push(exIndex);
      addSet(day.track_day_exercises_attributes[exIndex]);
    };

    service.addSet = function(ex) {
      var setIndex = ex.track_day_exercise_sets_attributes.length;
      ex.track_day_exercise_sets_attributes.push({ ord: 0, reps: 10, weight: 0 });
      if (setIndex > 0) {
        ex.track_day_exercise_sets_attributes[setIndex].ord = ex.track_day_exercise_sets_attributes[setIndex-1].ord + 1;
      }
      $scope.newIndexes.track_day_exercise_sets_attributes.push(setIndex);
      setTimeout(function() {RoutineService.toggleFields(true);}, 0);
    };

    service.destroyDay = function(dayIndex, event) {
      event.stopPropagation();
      var index = $scope.newIndexes.track_days_attributes.indexOf(dayIndex);
      if (index !== -1) {
        $scope.master.track_days_attributes.splice(dayIndex, 1);
        $scope.newIndexes.track_days_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.day-item').hide();
        $scope.master.track_days_attributes[dayIndex]._destroy = true;
      }
    };

    service.destroyExercise = function(day, exIndex, event) {
      event.stopPropagation();
      var index = $scope.newIndexes.track_day_exercises_attributes.indexOf(exIndex);
      if (index !== -1) {
        day.track_day_exercises_attributes.splice(exIndex, 1);
        $scope.newIndexes.track_day_exercises_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.exercise-item').hide();
        day.track_day_exercises_attributes[exIndex]._destroy = true;
      }
    };

    service.destroySet = function(ex, setIndex, event) {
      event.stopPropagation();
      var index = $scope.newIndexes.track_day_exercise_sets_attributes.indexOf(setIndex);
      if (index !== -1) {
        ex.track_day_exercise_sets_attributes.splice(setIndex, 1);
        $scope.newIndexes.track_day_exercise_sets_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.set-item').hide();
        ex.track_day_exercise_sets_attributes[setIndex]._destroy = true;
      }
    };
  }]);
