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

    service.toggleFields = function(value) {
      if (value) {
        $('.show-global').removeClass('hidden');
      } else {
        $('.show-global').addClass('hidden');
      }
    };

    service.editField = function(event) {
      event.stopPropagation();
      var $parent = $(event.target).parents('.program-field-box');
      $parent.find('.program-field-value').toggleClass('hidden');
      $parent.find('.edit-box').toggleClass('hidden');
    };

    service.initExercises = function() {
      ProgramsService.Exercises('', function(data, status) {
        var exercisesFound = [];
        var searchOptions = [];
        for (var i = 0; i < data.exercises.length; i++) {
          var ex = data.exercises[i];
          exercisesFound.push(ex);
          searchOptions.push({id: ex.id, text: ex.name});
        }
        service.scope.exercises = exercisesFound;
        window.search = new SearchOverlay({
          values: searchOptions,
          createNewFunction: function() {
            
          }
        });
      });
    };

    service.editExercise = function(event, ex) {
      event.stopPropagation();
      window.search.show();
      window.search.finishCallback = function() {
        service.scope.$apply(function() {
          var value = window.search.getValue();
          if (value !== null) {
            ex.exercise_id = value.id;
            ex.name = value.text;
          }
        });
      };
    };

    service.expandItem = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var $this = $(event.currentTarget);
      var $parent = $this.closest('.program-item');
      if ($parent.hasClass('rest-day') || $parent.hasClass('editing')) { return; }
      $parent.toggleClass('program-item-expanded');
    };

    service.toggleDayField = function(event) {
      event.stopPropagation();
      var $this = $(event.currentTarget);
      var $parent = $this.closest('.program-item');
      $parent.removeClass('program-item-expanded');
      $parent.toggleClass('editing');
      var $input = $parent.find('.program-item-value-input').first();
      if (typeof $input.attr('disabled') !== 'undefined') {
        $input.removeAttr('disabled');
      } else {
        $input.attr('disabled', 'disabled');
      }
    };

    service.toggleSetField = function(event) {
      event.stopPropagation();
      var $this = $(event.currentTarget);
      var $parent = $this.closest('.program-item');
      $parent.removeClass('program-item-expanded');
      $parent.toggleClass('editing');
      var $input = $parent.children('.program-item-text').find('.program-item-value-input');
      $input.each(function() {
        var $this = $(this);
        if (typeof $this.attr('disabled') !== 'undefined') {
          $this.removeAttr('disabled');
        } else {
          $this.attr('disabled', 'disabled');
        }
      });
    };

    service.addDay = function() {
      if (typeof service.scope.master.program_days_attributes === 'undefined') {
        service.scope.master.program_days_attributes = [];
      }
      var dayIndex = service.scope.master.program_days_attributes.length;
      service.scope.master.program_days_attributes.push({ name: 'Day ' + dayIndex, ord: 0, program_day_exercises_attributes: []});
      if (dayIndex > 0) {
        service.scope.master.program_days_attributes[dayIndex].ord = service.scope.master.program_days_attributes[dayIndex-1].ord + 1;
      }
      service.scope.newIndexes.program_days_attributes.push(dayIndex);
      service.addExercise(service.scope.master.program_days_attributes[dayIndex]);
    };

    service.addExercise = function(day) {
      var exIndex = day.program_day_exercises_attributes.length;
      day.program_day_exercises_attributes.push({ name: 'Pick an exercise', ord: 0, program_day_exercise_sets_attributes: [] });
      if (exIndex > 0) {
        day.program_day_exercises_attributes[exIndex].ord = day.program_day_exercises_attributes[exIndex-1].ord + 1;
      }
      service.scope.newIndexes.program_day_exercises_attributes.push(exIndex);
      service.addSet(day.program_day_exercises_attributes[exIndex]);
    };

    service.addSet = function(ex) {
      var setIndex = ex.program_day_exercise_sets_attributes.length;
      ex.program_day_exercise_sets_attributes.push({ ord: 0, reps: 10 });
      if (setIndex > 0) {
        ex.program_day_exercise_sets_attributes[setIndex].ord = ex.program_day_exercise_sets_attributes[setIndex-1].ord + 1;
      }
      service.scope.newIndexes.program_day_exercise_sets_attributes.push(setIndex);
      setTimeout(function() {service.toggleFields(true);}, 0);
    };

    service.destroyDay = function(dayIndex, event) {
      event.stopPropagation();
      var index = service.scope.newIndexes.program_days_attributes.indexOf(dayIndex);
      if (index !== -1) {
        service.scope.master.program_days_attributes.splice(dayIndex, 1);
        service.scope.newIndexes.program_days_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.day-item').hide();
        service.scope.master.program_days_attributes[dayIndex]._destroy = true;
      }
    };

    service.destroyExercise = function(day, exIndex, event) {
      event.stopPropagation();
      var index = service.scope.newIndexes.program_day_exercises_attributes.indexOf(exIndex);
      if (index !== -1) {
        day.program_day_exercises_attributes.splice(index, 1);
        service.scope.newIndexes.program_day_exercises_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.exercise-item').hide();
        day.program_day_exercises_attributes[exIndex]._destroy = true;
      }
    };

    service.destroySet = function(ex, setIndex, event) {
      event.stopPropagation();
      var index = service.scope.newIndexes.program_day_exercise_sets_attributes.indexOf(setIndex);
      if (index !== -1) {
        ex.program_day_exercise_sets_attributes.splice(setIndex, 1);
        service.scope.newIndexes.program_day_exercise_sets_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.set-item').hide();
        ex.program_day_exercise_sets_attributes[setIndex]._destroy = true;
      }
    };

    return service;
  }]);
