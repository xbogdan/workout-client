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

    $scope.renderSelect2 = function() {
      $(".exercise-select").select2({
        dropdownCssClass : 'show-select-search'
      });
    };

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
        $scope.editing = true;
        $scope.showEditButton = false;
        $scope.program = {};
        $scope.program.private = false;
        $scope.program.level = 'beginner';
        $scope.program.goal = 'fat-loss';
        $scope.master = angular.copy($scope.program);
        addDay();
      }

      $scope.treeOptions = {
        accept: function(sourceNode, destNodes, destIndex) {
          var sourceType = sourceNode.$element.attr('data-type');
          var destType = destNodes.$element.attr('data-type');
          return (sourceType == destType);
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
        window.search = new searchOverlay(searchOptions);
      });
    }

    function toggleTree() {
      $scope.treeEnabled = !$scope.treeEnabled;
    }

    function changeGlobalEdit(event, cancel) {
      var showGlobal = document.getElementsByClassName('show-global');
      var show = false;
      for (var i = 0; i < showGlobal.length; i++) {
        if (showGlobal[i].className.indexOf('hidden') > -1) {
          show = true;
          showGlobal[i].className = showGlobal[i].className.replace(/\hidden\b/,'');
        } else {
          showGlobal[i].className += ' hidden';
        }
      }
      toggleTree();
      if (typeof cancel === 'undefined' || cancel === false) {
        updateProgram();
        event.target.innerHTML = show ? 'Finish' : 'Edit';
      } else {
        $scope.master = angular.copy($scope.program);
        $('#global-edit').html('Edit');
      }
    }

    function submit() {
      if (!$routeParams.id) {
        ProgramsService.createProgram($scope.master, function(data, status) {
          if (status === 201) {
            $location.path('/');
          } else {
            alert('error');
          }
        });
      }
    }

    function updateProgram() {
      if ($routeParams.id) {
        ProgramsService.editProgram($scope.master, function(data, status) {
          if (status != 200) {
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
          if (value != null) {
            ex.exercise_id = value.id;
            ex.name = value.text;
          }
        });
      };
    }

    function addExercise(dayIndex) {
      if (typeof $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes === 'undefined') {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes = [];
      }
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.push({});
      var exIndex = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.length - 1;
      $scope.newIndexes.program_day_exercises_attributes.push(exIndex);

      addSet(dayIndex, exIndex);
    }

    function addSet(dayIndex, exIndex) {
      if (typeof $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes === 'undefined') {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes = [];
      }
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.push({});
      var setIndex = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.length - 1;
      $scope.newIndexes.program_day_exercise_sets_attributes.push(setIndex);
    }

    function addDay() {
      if (typeof $scope.master.program_days_attributes === 'undefined') {
        $scope.master.program_days_attributes = [];
      }
      $scope.master.program_days_attributes.push({});
      var dayIndex = $scope.master.program_days_attributes.length - 1;
      if (dayIndex > 0) {
        $scope.master.program_days_attributes[dayIndex].ord = $scope.master.program_days_attributes[dayIndex-1].ord + 1;
      }
      $scope.newIndexes.program_days_attributes.push(dayIndex);
      addExercise(dayIndex);
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
