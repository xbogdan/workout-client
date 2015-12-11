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
  .controller('TrackDayController', ['$scope', '$routeParams', '$location', 'TracksService', 'ProgramsService', '$rootScope', 'RoutineListService', function ($scope, $routeParams, $location, TracksService, ProgramsService, $rootScope, RoutineService) {

    $scope.editExercise = RoutineService.editExercise;
    $scope.editField = RoutineService.editField;
    $scope.toggleSetField = toggleSetField;
    $scope.expandItem = RoutineService.expandItem;
    $scope.changeGlobalEdit = changeGlobalEdit;
    $scope.addExercise = addExercise;
    $scope.destroyExercise = destroyExercise;
    $scope.destroySet = destroySet;
    $scope.addSet = addSet;
    $scope.newIndexes = {
      'track_days_attributes': [],
      'track_day_exercises_attributes': [],
      'track_day_exercise_sets_attributes': []
    };

    if ($routeParams.id) {
      TracksService.Track($routeParams.id, function(data) {
        $scope.master = data.track;
        $scope.track = angular.copy($scope.master);

        if ($routeParams.dayId > $scope.master.track_days_attributes.length-1 || $routeParams.dayId < 0) {
          alert('Error. Invalid day.');
        }
        $scope.day = $scope.master.track_days_attributes[$routeParams.dayId];
      });
      RoutineService.initExercises();
      RoutineService.init($scope);
      window.overlayform = new of({
        fields: [
          {
            label: 'Reps',
            inputType: 'text'
          },
          {
            label: 'Kg',
            inputType: 'text'
          }
        ]
      });
    }

    function toggleSetField(event, set) {
      event.stopPropagation();
      var $parent = $(event.target).parents('.program-field-box');
      overlayform.inputs[0].value = set.weight;
      overlayform.inputs[1].value = set.reps;
      overlayform.show();
      overlayform.finishCallback = function(data) {
        $scope.$apply(function() {
          set.weight = data[0].value;
          set.reps = data[1].value;
        });
      };
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

    function addExercise(day) {
      window.search.show();
      window.search.finishCallback = function() {
        $scope.$apply(function() {
          var value = window.search.getValue();
          if (value !== null) {
            var exIndex = day.track_day_exercises_attributes.length;
            day.track_day_exercises_attributes.push({ name: value.text, exercise_id: value.id, ord: 0, track_day_exercise_sets_attributes: [] });
            if (exIndex > 0) {
              day.track_day_exercises_attributes[exIndex].ord = day.track_day_exercises_attributes[exIndex-1].ord + 1;
            }
            $scope.newIndexes.track_day_exercises_attributes.push(exIndex);
          }
          setTimeout(function() {RoutineService.toggleFields(true);}, 0);
        });
      };
    }

    function addSet(ex) {
      overlayform.show();
      overlayform.finishCallback = function(data) {
        $scope.$apply(function() {
          var setIndex = ex.track_day_exercise_sets_attributes.length;
          ex.track_day_exercise_sets_attributes.push({ ord: 0, reps: data[0].value, weight: data[1].value });
          if (setIndex > 0) {
            ex.track_day_exercise_sets_attributes[setIndex].ord = ex.track_day_exercise_sets_attributes[setIndex-1].ord + 1;
          }
          $scope.newIndexes.track_day_exercise_sets_attributes.push(setIndex);
          setTimeout(function() {RoutineService.toggleFields(true);}, 0);
        });
      };
      overlayform.afterHide = function() {
        overlayform.finishCallback = null;
      };
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
