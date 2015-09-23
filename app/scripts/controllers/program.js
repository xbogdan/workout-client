'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ProgramCtrl
 * @description
 * # ProgramCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramCtrl', ['$scope', '$routeParams', '$location', 'ProgramsService', '$rootScope', function ($scope, $routeParams, $location, ProgramsService, $rootScope) {

    $scope.submit = submit;
    $scope.toggleRestDay = toggleRestDay;
    $scope.expandItem = expandItem;
    $scope.editField = editField;
    $scope.addDay = addDay;
    $scope.addExercise = addExercise;
    $scope.addSet = addSet;
    $scope.editExercise = editExercise;
    $scope.destroyDay = destroyDay;
    $scope.destroyExercise = destroyExercise;
    $scope.destroySet = destroySet;
    $scope.updateProgram = updateProgram;
    $scope.toggleTree = toggleTree;
    $scope.treeEnabled = false;
    $scope.changeGlobalEdit = changeGlobalEdit;
    $scope.newIndexes = {
      'program_days_attributes': [],
      'program_day_exercises_attributes': [],
      'program_day_exercise_sets_attributes': []
    };
    $("#goal-select").select2();

    init();

    function init() {
      if ($routeParams.id) {
        $scope.showEditButton = true;
        ProgramsService.Program($routeParams.id, function(data) {
          $scope.master = data.program;
          $scope.program = angular.copy($scope.master);
          setTimeout(function() {$("#private-switch").bootstrapSwitch();}, 1);
          initExercises();
        });
      } else {
        initExercises();
        $scope.editing = true;
        $scope.showEditButton = false;
        $scope.master = {};
        $scope.master.private = false;
        $scope.master.level = 'beginner';
        $scope.master.goal = 'fat-loss';
        $scope.program = angular.copy($scope.master);
      }

      $scope.treeOptions = {
        accept: function(sourceNode, destNodes, destIndex) {
          var sourceType = sourceNode.$element.attr('data-type');
          var destType = destNodes.$element.attr('data-type');
          return (sourceType === destType);
        },
        dropped: function(e) {
          e.source.nodeScope.$modelValue.ord = e.dest.index;
          var nodes = e.dest.nodesScope.childNodes();
          for (var i = 0; i < nodes.length; i++) {
            nodes[i].$modelValue.ord = i;
          }
        }
      };
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
        window.search = new SearchOverlay(searchOptions);
      });
    }

    function expandItem(event) {
      event.preventDefault();
      event.stopPropagation();
      var $this = $(event.currentTarget);
      var $parent = $this.closest('.program-item');
      if ($parent.hasClass('rest-day')) { return; }
      $parent.toggleClass('program-item-expanded');
    }

    function toggleTree() {
      $scope.treeEnabled = !$scope.treeEnabled;
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
      toggleTree();
      if (!show && !cancel) {
        updateProgram();
      }
      if (cancel) {
        $scope.master = angular.copy($scope.program);
      }
      $('#global-edit').toggleClass('hidden');
      $('#global-finish').toggleClass('hidden');
    }

    function submit() {
      if (!$routeParams.id) {
        fixRestDays();
        ProgramsService.createProgram($scope.master, function(data, status) {
          if (status === 201) {
            $location.path('/');
          } else {
            alert('error');
          }
        });
      }
    }

    function fixRestDays(update) {
      if (typeof update === 'undefined') { update = false; }
      for (var i = 0; i < $scope.master.program_days_attributes.length; i++) {
        var day = $scope.master.program_days_attributes[i];
        if (day.rest_day) {
          if (update === false) {
            day.program_day_exercises_attributes = null;
          } else {
            for (var j = 0; j < day.program_day_exercises_attributes.length; j++) {
              var exercise = day.program_day_exercises_attributes[j];
              exercise._destroy = true;
              for (var k = 0; k < exercise.program_day_exercise_sets_attributes.length; k++) {
                var set = exercise.program_day_exercise_sets_attributes[k];
                set._destroy = true;
              }
            }
          }
        }
      }
    }

    function updateProgram() {
      if ($routeParams.id) {
        fixRestDays(true);
        $('.edit-box:not(.hidden)').addClass('hidden');
        $('.program-item-text.hidden').removeClass('hidden');
        $('.program-field-value.hidden').removeClass('hidden');
        ProgramsService.editProgram($scope.master, function(data, status) {
          if (status !== 200) {
            alert('Error updating program. Response received with status: ' + status);
          } else {
            $scope.program = angular.copy($scope.master);
          }
        });
      }
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
          if (value !== null) {
            ex.exercise_id = value.id;
            ex.name = value.text;
          }
        });
      };
    }

    function toggleRestDay(event, dayIndex) {
      event.preventDefault();
      event.stopPropagation();
      var day = $scope.master.program_days_attributes[dayIndex];
      day.rest_day = !day.rest_day;
      if (day.rest_day) {
        day.name = 'Rest day';
      } else {
        day.name = 'Day '+dayIndex;
      }
      $(event.currentTarget).closest('.program-item').removeClass('program-item-expanded').toggleClass('rest-day');
    }

    function addDay() {
      if (typeof $scope.master.program_days_attributes === 'undefined') {
        $scope.master.program_days_attributes = [];
      }
      var dayIndex = $scope.master.program_days_attributes.length;
      $scope.master.program_days_attributes.push({ name: 'Day ' + dayIndex, ord: dayIndex});
      if (dayIndex > 0) {
        $scope.master.program_days_attributes[dayIndex].ord = $scope.master.program_days_attributes[dayIndex-1].ord + 1;
      }
      $scope.newIndexes.program_days_attributes.push(dayIndex);
      addExercise(dayIndex);
    }

    function addExercise(dayIndex) {
      if (typeof $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes === 'undefined') {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes = [];
      }
      var exIndex = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.length;
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.push({ name: 'Pick an exercise.', ord: exIndex });
      if (exIndex > 0) {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].ord = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex-1].ord + 1;
      }
      $scope.newIndexes.program_day_exercises_attributes.push(exIndex);
      addSet(dayIndex, exIndex);
    }

    function addSet(dayIndex, exIndex) {
      if (typeof $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes === 'undefined') {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes = [];
      }
      var setIndex = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.length;
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.push({ ord: setIndex });
      if (setIndex > 0) {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes[setIndex].ord = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes[setIndex-1].ord + 1;
      }
      $scope.newIndexes.program_day_exercise_sets_attributes.push(setIndex);
      setTimeout(function() {toggleFields(true);}, 0);
    }

    function destroyDay(dayIndex, event) {
      var index = $scope.newIndexes.program_days_attributes.indexOf(dayIndex);
      if (index !== -1) {
        $scope.master.program_days_attributes.splice(dayIndex, 1);
        $scope.newIndexes.program_days_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.day-item').hide();
        $scope.master.program_days_attributes[dayIndex]._destroy = true;
      }
    }

    function destroyExercise(dayIndex, exIndex, event) {
      var index = $scope.newIndexes.program_day_exercises_attributes.indexOf(exIndex);
      if (index !== -1) {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.splice(exIndex, 1);
        $scope.newIndexes.program_day_exercises_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.exercise-item').hide();
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex]._destroy = true;
      }
    }

    function destroySet(dayIndex, exIndex, setIndex, event) {
      var index = $scope.newIndexes.program_day_exercise_sets_attributes.indexOf(setIndex);
      if (index !== -1) {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.splice(setIndex, 1);
        $scope.newIndexes.program_day_exercise_sets_attributes.splice(index, 1);
      } else {
        $(event.currentTarget).closest('.exercise-item').hide();
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes[setIndex]._destroy = true;
      }
    }

  }]);
