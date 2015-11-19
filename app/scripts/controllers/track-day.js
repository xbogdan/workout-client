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
      var overlayform = new of({
        fields: [
          {
            label: 'Kg',
            inputType: 'text'
          },
          {
            label: 'Reps',
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
      }
      // $parent.find('.program-field-value').toggleClass('hidden');
      // $parent.find('.edit-box').toggleClass('hidden');
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

    function addExercise(day, label) {
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

  }]);
