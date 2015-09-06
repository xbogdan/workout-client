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

    $scope.toggleEdit = toggleEdit;
    $scope.submit = submit;
    $scope.addExercise = addExercise;
    $scope.addSet = addSet;
    $scope.addDay = addDay;
    $scope.editDay = editDay;
    $scope.editSet = editSet;
    $scope.destroyDay = destroyDay;
    $scope.destroyExercise = destroyExercise;
    $scope.destroySet = destroySet;
    $scope.updateProgram = updateProgram;
    $scope.editExercise = editExercise;
    $scope.levels = ['beginner', 'intermmediate', 'advanced'];
    $scope.treeEnabled = false;
    $scope.toggleTree = toggleTree;
    $scope.allowEditField = false;
    $scope.allowGlobalEdit = false;
    $scope.changeGlobalEdit = changeGlobalEdit;
    $scope.editSetField = [];
    $scope.editDayField = [];
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
          setTimeout(function() {$("#private-switch").bootstrapSwitch();}, 1);
        });
      } else {
        $scope.editing = true;
        $scope.showEditButton = false;
        $scope.program = {};
        $scope.program.private = false;
        $scope.program.level = 'beginner';
        $scope.program.goal = 'fat-loss';
        $scope.master = $scope.program;
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

    // TODO remove
    function toggleEdit(updated) {
      $scope.master = $scope.program;
      $scope.masterCopy = angular.copy($scope.master);
      if (!updated) {
        $scope.master = angular.copy($scope.masterCopy);
      }
    }

    function toggleTree() {
      $scope.treeEnabled = !$scope.treeEnabled;
    }

    function changeGlobalEdit() {
      $scope.allowGlobalEdit = !$scope.allowGlobalEdit;
      if ($scope.treeEnabled) {
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

    function submit() {
      if ($routeParams.id) {
        ProgramsService.editProgram($scope.master, function(data) {
          $scope.toggleEdit(true);
          ProgramsService.Program($routeParams.id, function(data) {
            $scope.program = data.program;
          });
          $scope.program = $scope.master;
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
            $scope.master = $scope.program;
          }
        });
      }
    }

    function editExercise(ex) {
      window.search.show();
      window.search.finishCallback = function() {
        var value = window.search.getValue();
        if (value != null) {
          ex.exercise_id = value.id;
          ex.name = value.text;
        }
      };
    }

    function editSet(set, index) {
      $scope.editSetField[index] = !$scope.editSetField[index];
    }

    function editDay(day, index) {
      $scope.editDayField[index] = !$scope.editDayField[index];
    }

    function addExercise(dayIndex) {
      if (typeof $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes === 'undefined') {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes = [];
      }
      $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes.push({});
      var exIndex = $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes.length - 1;
      addSet(dayIndex, exIndex);

      $scope.master = $scope.program;
      setTimeout(function() {
        $('select.exercise-select:not(.select2-offscreen)').select2();
      }, 1);

    }

    function addSet(dayIndex, exIndex) {
      if (typeof $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes === 'undefined') {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes = [];
      }
      $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.push({});

      $scope.master = $scope.program;
    }

    function addDay() {
      if (typeof $scope.program.program_days_attributes === 'undefined') {
        $scope.program.program_days_attributes = [];
      }
      $scope.program.program_days_attributes.push({});
      var dayIndex = $scope.program.program_days_attributes.length - 1;
      if (dayIndex > 0) {
        $scope.program.program_days_attributes[dayIndex].ord = $scope.program.program_days_attributes[dayIndex-1].ord + 1;
      }
      addExercise(dayIndex);

      $scope.master = $scope.program;
    }

    function destroyDay(dayIndex) {
      $scope.program.program_days_attributes.splice(dayIndex, 1);
      $scope.master = $scope.program;
    }

    function destroyExercise(dayIndex, exIndex) {
      $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes.splice(exIndex, 1);
      $scope.master = $scope.program;
    }

    function destroySet(dayIndex, exIndex, setIndex) {
      $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.splice(setIndex, 1);
      $scope.master = $scope.program;
    }

  }]);
