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
  .controller('TrackController', ['$scope', '$routeParams', '$location', 'TracksService', 'ProgramsService', '$rootScope', function ($scope, $routeParams, $location, TracksService, ProgramsService, $rootScope) {

    $scope.submit = submit;
    $scope.editField = editField;
    $scope.expandItem = expandItem;
    $scope.changeGlobalEdit = changeGlobalEdit;
    $scope.addDay = addDay;
    $scope.addExercise = addExercise;
    $scope.addSet = addSet;
    $scope.editExercise = editExercise;
    $scope.destroyDay = destroyDay;
    $scope.destroyExercise = destroyExercise;
    $scope.destroySet = destroySet;
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
      if ($routeParams.id) {
        TracksService.Track($routeParams.id, function(data) {
          $scope.master = data.track;
          for (var i = 0; i < $scope.master.track_days_attributes.length; i++) {
            var d = new Date($scope.master.track_days_attributes[i].date);
          }
          $scope.track = angular.copy($scope.master);
          initExercises();
          setTimeout(function() {
            var $input = $('#pick-a-date').pickadate();
            $scope.picker = $input.pickadate('picker');
            $scope.picker.on({
              close: function() {
                $scope.master.track_days_attributes[$scope.openedDayIndex].date = $scope.picker.get();
                $scope.$apply();
              }
            });
          }, 0);
        });
      } else {
      }
    }

    $scope.openPicker = openPicker;
    function openPicker(index) {
      $scope.openedDayIndex = index;
      $scope.picker.open();
    }

    function initExercises() {
      ProgramsService.Exercises('', function(data, status) {
        var exercises_found = [];
        var searchOptions = [];
        for (var i = 0; i < data.exercises.length; i++) {
          var ex = data.exercises[i];
          exercises_found.push(ex);
          searchOptions.push({id: ex.id, text: ex.name});
        }
        $scope.exercises = exercises_found;
        window.search = new searchOverlay(searchOptions);
      });
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

    function toggleFields(value) {
      var showGlobal = document.getElementsByClassName('show-global');
      for (var i = 0; i < showGlobal.length; i++) {
        if (value) {
          showGlobal[i].className = showGlobal[i].className.replace(/\hidden\b/,'');
        } else {
          showGlobal[i].className += ' hidden';
        }
      }
    }

    function changeGlobalEdit(show, cancel) {
      toggleFields(show);
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
          if (status != 200) {
            alert('Error updating program. Response received with status: ' + status);
          } else {
            $scope.track = angular.copy($scope.master);
          }
        });
      }
    }

    function expandItem(event) {
      event.preventDefault();
      event.stopPropagation();
      var $this = $(event.currentTarget);
      var $parent = $this.closest('.program-item');
      if ($parent.hasClass('rest-day')) return;
      $parent.toggleClass('program-item-expanded');
    }

    function editField(event) {
      var $parent = $(event.target).parents('.program-field-box');
      $parent.find('.program-field-value').toggleClass('hidden');
      $parent.find('.edit-box').toggleClass('hidden');
    }

    function editExercise(ex) {
      window.search.show();
      window.search.finishCallback = function() {
        $scope.$apply(function() {
          var value = window.search.getValue();
          if (value != null) {
            ex.exercise_id = value.id;
            ex.name = value.text;
          }
        });
      };
    }

    function addDay() {
      if (typeof $scope.master.track_days_attributes === 'undefined') {
        $scope.master.track_days_attributes = [];
      }
      var dayIndex = $scope.master.track_days_attributes.length;
      var date = new Date();
      $scope.master.track_days_attributes.push({ date: date.toISOString()});
      if (dayIndex > 0) {
        $scope.master.track_days_attributes[dayIndex].ord = $scope.master.track_days_attributes[dayIndex-1].ord + 1;
      }
      $scope.newIndexes.track_days_attributes.push(dayIndex);
      addExercise(dayIndex);
    }

    function addExercise(dayIndex) {
      if (typeof $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes === 'undefined') {
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes = [];
      }
      var exIndex = $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes.length;
      $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes.push({ name: 'Pick an exercise.', ord: exIndex });
      if (exIndex > 0) {
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].ord = $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex-1].ord + 1;
      }
      $scope.newIndexes.track_day_exercises_attributes.push(exIndex);

      addSet(dayIndex, exIndex);
    }

    function addSet(dayIndex, exIndex) {
      if (typeof $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes === 'undefined') {
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes = [];
      }
      var setIndex = $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes.length;
      $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes.push({ ord: setIndex });
      if (setIndex > 0) {
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes[setIndex].ord = $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes[setIndex-1].ord + 1;
      }
      $scope.newIndexes.track_day_exercise_sets_attributes.push(setIndex);
      setTimeout(function() {toggleFields(true);}, 0);
    }

    function destroyDay(dayIndex, event) {
      var index = $scope.newIndexes.track_days_attributes.indexOf(dayIndex);
      if (index !== -1) {
        $scope.master.track_days_attributes.splice(dayIndex, 1);
        $scope.newIndexes.track_days_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.day-item').hide();
        $scope.master.track_days_attributes[dayIndex]._destroy = true;
      }
    }

    function destroyExercise(dayIndex, exIndex, event) {
      var index = $scope.newIndexes.track_day_exercises_attributes.indexOf(exIndex);
      if (index !== -1) {
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes.splice(exIndex, 1);
        $scope.newIndexes.track_day_exercises_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.exercise-item').hide();
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex]._destroy = true;
      }
    }

    function destroySet(dayIndex, exIndex, setIndex, event) {
      var index = $scope.newIndexes.track_day_exercise_sets_attributes.indexOf(setIndex);
      if (index !== -1) {
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes.splice(setIndex, 1);
        $scope.newIndexes.track_day_exercise_sets_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.set-item').hide();
        $scope.master.track_days_attributes[dayIndex].track_day_exercises_attributes[exIndex].track_day_exercise_sets_attributes[setIndex]._destroy = true;
      }
    }

  }]);
