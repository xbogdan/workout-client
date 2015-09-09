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
    $scope.addDay = addDay;
    $scope.addExercise = addExercise;
    $scope.addSet = addSet;
    $scope.editDay = editDay;
    $scope.editExercise = editExercise;
    $scope.editSet = editSet;
    $scope.destroyDay = destroyDay;
    $scope.destroyExercise = destroyExercise;
    $scope.destroySet = destroySet;
    $scope.updateProgram = updateProgram;
    $scope.toggleTree = toggleTree;
    $scope.treeEnabled = false;
    $scope.allowGlobalEdit = false;
    $scope.changeGlobalEdit = changeGlobalEdit;
    $scope.editSetField = [];
    $scope.editDayField = [];
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
      initExercises();
      if ($routeParams.id) {
        $scope.showEditButton = true;
        ProgramsService.Program($routeParams.id, function(data) {
          $scope.program = data.program;
          $scope.master = angular.copy($scope.program);
          setTimeout(function() {$("#private-switch").bootstrapSwitch();}, 1);
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

    function changeGlobalEdit() {
      $scope.allowGlobalEdit = !$scope.allowGlobalEdit;
      if ($scope.treeEnabled) {
        toggleTree();
      } else {
        toggleTree();
      }
      if (!$scope.allowGlobalEdit) {
        updateProgram();
      }
      for (var i = 0; i < $scope.editDayField.length; i++) {
        $scope.editDayField[i] = false;
      }

      for (var i = 0; i < $scope.editSetField.length; i++) {
        $scope.editSetField[i] = false;
      }
    }

    // TODO remove
    function submit() {
      if ($routeParams.id) {
        ProgramsService.editProgram($scope.master, function(data) {
          $scope.toggleEdit(true);
          ProgramsService.Program($routeParams.id, function(data) {
            $scope.program = data.program;
          });
          $scope.program = angular.copy($scope.master);
        });
      } else {
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
        ProgramsService.editProgram($scope.program, function(data, status) {
          if (status != 200) {
            alert('Error updating program. Response received with status: ' + status);
          } else {
            $scope.program = angular.copy($scope.master);
          }
        });
      }
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
          $scope.program = angular.copy($scope.master);
        });
      };
    }

    function editSet(set, index) {
      $scope.editSetField[index] = !$scope.editSetField[index];
      $scope.program = angular.copy($scope.master);
    }

    function editDay(day, index) {
      $scope.editDayField[index] = !$scope.editDayField[index];
      $scope.program = angular.copy($scope.master);
    }

    function addExercise(dayIndex) {
      if (typeof $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes === 'undefined') {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes = [];
      }
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.push({});
      var exIndex = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.length - 1;
      $scope.newIndexes.program_day_exercises_attributes.push(exIndex);

      $scope.program = angular.copy($scope.master);
      addSet(dayIndex, exIndex);
    }

    function addSet(dayIndex, exIndex) {
      if (typeof $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes === 'undefined') {
        $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes = [];
      }
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.push({});
      var setIndex = $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.length - 1;
      $scope.newIndexes.program_day_exercise_sets_attributes.push(setIndex);

      $scope.program = angular.copy($scope.master);
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
      $scope.program = angular.copy($scope.master);
      addExercise(dayIndex);
    }

    function destroyDay(dayIndex) {
      $scope.master.program_days_attributes.splice(dayIndex, 1);
      var index = $scope.newIndexes.program_days_attributes.indexOf(dayIndex);
      if (index !== -1) {
        $scope.program.program_days_attributes.splice(dayIndex, 1);
        $scope.newIndexes.program_days_attributes.splice(index, 1);
      } else {
        $scope.program.program_days_attributes[dayIndex]._destroy = true;
      }
    }

    function destroyExercise(dayIndex, exIndex) {
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes.splice(exIndex, 1);
      var index = $scope.newIndexes.program_day_exercises_attributes.indexOf(exIndex);
      if (index !== -1) {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes.splice(exIndex, 1);
        $scope.newIndexes.program_day_exercises_attributes.splice(index, 1);
      } else {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex]._destroy = true;
      }
    }

    function destroySet(dayIndex, exIndex, setIndex) {
      $scope.master.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.splice(setIndex, 1);
      var index = $scope.newIndexes.program_day_exercise_sets_attributes.indexOf(setIndex);
      if (index !== -1) {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.splice(setIndex, 1);
        $scope.newIndexes.program_day_exercise_sets_attributes.splice(index, 1);
      } else {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes[setIndex]._destroy = true;
      }
    }

  }]);
