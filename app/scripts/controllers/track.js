'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:TrackController
 * @description
 * # TrackController
 * Controller of the workoutClientApp
 */
// angular.module('workoutClientApp', ['ui.bootstrap']);
angular.module('workoutClientApp')
  .controller('TrackController', ['$scope', '$routeParams', '$location', 'TracksService', 'ProgramsService', '$rootScope', 'RoutineListService', function ($scope, $routeParams, $location, TracksService, ProgramsService, $rootScope, RoutineService) {

    $scope.submit = submit;
    $scope.editField = RoutineService.editField;
    $scope.expandItem = RoutineService.expandItem;
    $scope.changeGlobalEdit = changeGlobalEdit;
    $scope.addDay = addDay;
    $scope.addExercise = addExercise;
    $scope.addSet = addSet;
    $scope.editExercise = RoutineService.editExercise;
    $scope.destroyDay = destroyDay;
    $scope.destroyExercise = destroyExercise;
    $scope.destroySet = destroySet;
    $scope.openPicker = openPicker;
    $scope.newIndexes = {
      'track_days_attributes': [],
      'track_day_exercises_attributes': [],
      'track_day_exercise_sets_attributes': []
    };

    $scope.openDatePicker = function(day) {
      day.opened = true;
    };

    $scope.format = 'dd-MMMM-yyyy';

    init();
    $scope.openedDay = null;
    function init() {
      RoutineService.initExercises();
      RoutineService.init($scope);

      setTimeout(function() {
        var $input = $('#pick-a-date').pickadate({
          clear: false
        });
        $scope.picker = $input.pickadate('picker');
        $scope.picker.on({
          close: function() {
            $scope.master.track_days_attributes[$scope.openedDayIndex].date = $scope.picker.get();
            $scope.$apply();
          }
        });
      }, 0);

      if ($routeParams.id) {
        TracksService.Track($routeParams.id, function(data) {
          $scope.master = data.track;
          $scope.track = angular.copy($scope.master);
        });
      } else {
        $scope.master = {};
        $scope.program = angular.copy($scope.master);
      }
    }

    function openPicker(index) {
      $scope.openedDayIndex = index;
      $scope.picker.open();
    }

    function submit() {
      if (!$routeParams.id) {
        TracksService.createTrack($scope.master, function(data, status) {
          if (status === 201) {
            $location.path('/tracks');
          } else {
            alert('error');
          }
        });
      }
    }

    function changeGlobalEdit(show, cancel) {
      RoutineService.toggleFields(show);
      if (!show && !cancel) {
        updateTrack();
      }
      if (cancel) {
        $scope.master = angular.copy($scope.track);
      }
      $('#global-edit').toggleClass('hidden');
      $('#global-finish').toggleClass('hidden');
    }

    function updateTrack() {
      if ($routeParams.id) {
        $('.edit-box:not(.hidden)').addClass('hidden');
        $('.program-item-text.hidden').removeClass('hidden');
        $('.program-field-value.hidden').removeClass('hidden');
        TracksService.editTrack($scope.master, function(data, status) {
          if (status !== 200) {
            alert('Error updating program. Response received with status: ' + status);
          } else {
            $scope.track = angular.copy($scope.master);
          }
        });
      }
    }

    $scope.toggleSetField = function(event) {
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

    function addDay() {
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
    }

    function addExercise(day) {
      var exIndex = day.track_day_exercises_attributes.length;
      day.track_day_exercises_attributes.push({ name: 'Pick an exercise.', ord: 0, track_day_exercise_sets_attributes: [] });
      if (exIndex > 0) {
        day.track_day_exercises_attributes[exIndex].ord = day.track_day_exercises_attributes[exIndex-1].ord + 1;
      }
      $scope.newIndexes.track_day_exercises_attributes.push(exIndex);
      addSet(day.track_day_exercises_attributes[exIndex]);
    }

    function addSet(ex) {
      var setIndex = ex.track_day_exercise_sets_attributes.length;
      ex.track_day_exercise_sets_attributes.push({ ord: 0, reps: 10, weight: 0 });
      if (setIndex > 0) {
        ex.track_day_exercise_sets_attributes[setIndex].ord = ex.track_day_exercise_sets_attributes[setIndex-1].ord + 1;
      }
      $scope.newIndexes.track_day_exercise_sets_attributes.push(setIndex);
      setTimeout(function() {RoutineService.toggleFields(true);}, 0);
    }

    function destroyDay(dayIndex, event) {
      event.stopPropagation();
      var index = $scope.newIndexes.track_days_attributes.indexOf(dayIndex);
      if (index !== -1) {
        $scope.master.track_days_attributes.splice(dayIndex, 1);
        $scope.newIndexes.track_days_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.day-item').hide();
        $scope.master.track_days_attributes[dayIndex]._destroy = true;
      }
    }

    function destroyExercise(day, exIndex, event) {
      event.stopPropagation();
      var index = $scope.newIndexes.track_day_exercises_attributes.indexOf(exIndex);
      if (index !== -1) {
        day.track_day_exercises_attributes.splice(exIndex, 1);
        $scope.newIndexes.track_day_exercises_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.exercise-item').hide();
        day.track_day_exercises_attributes[exIndex]._destroy = true;
      }
    }

    function destroySet(ex, setIndex, event) {
      event.stopPropagation();
      var index = $scope.newIndexes.track_day_exercise_sets_attributes.indexOf(setIndex);
      if (index !== -1) {
        ex.track_day_exercise_sets_attributes.splice(setIndex, 1);
        $scope.newIndexes.track_day_exercise_sets_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.set-item').hide();
        ex.track_day_exercise_sets_attributes[setIndex]._destroy = true;
      }
    }

  }]);
