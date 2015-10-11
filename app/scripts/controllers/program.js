'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ProgramCtrl
 * @description
 * # ProgramCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramCtrl', ['$scope', '$routeParams', '$location', 'ProgramsService', '$rootScope', 'RoutineListService', function ($scope, $routeParams, $location, ProgramsService, $rootScope, RoutineService) {

    $scope.submit = submit;
    $scope.toggleRestDay = toggleRestDay;
    $scope.expandItem = RoutineService.expandItem;
    $scope.editField = RoutineService.editField;
    $scope.addDay = RoutineService.addDay;
    $scope.addExercise = RoutineService.addExercise;
    $scope.addSet = RoutineService.addSet;
    $scope.editExercise = RoutineService.editExercise;
    $scope.destroyDay = RoutineService.destroyDay;
    $scope.destroyExercise = RoutineService.destroyExercise;
    $scope.destroySet = RoutineService.destroySet;
    $scope.toggleDayField = RoutineService.toggleDayField;
    $scope.toggleSetField = RoutineService.toggleSetField;
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
        });
      } else {
        $scope.editing = true;
        $scope.showEditButton = false;
        $scope.master = {};
        $scope.master.private = false;
        $scope.master.level = 'beginner';
        $scope.master.goal = 'fat-loss';
        $scope.program = angular.copy($scope.master);
        setTimeout(function() { toggleTree(); }, 0);
      }

      RoutineService.initExercises();
      RoutineService.init($scope);

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

    function toggleTree() {
      $scope.treeEnabled = !$scope.treeEnabled;
      $('.angular-ui-tree').toggleClass('angular-ui-tree-enabled');
    }

    function changeGlobalEdit(show, cancel) {
      RoutineService.toggleFields(show);
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
      if (typeof $scope.master.program_days_attributes === 'undefined') return;
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

    function toggleRestDay(event, dayIndex) {
      event.preventDefault();
      event.stopPropagation();
      var day = $scope.master.program_days_attributes[dayIndex];
      day.rest_day = !day.rest_day;
      if (day.rest_day) {
        day.oldName = day.name;
        day.name = 'Rest day';
      } else {
        day.name = day.oldName;
      }
      // $(event.currentTarget).closest('.program-item').removeClass('program-item-expanded').toggleClass('rest-day');
    }

  }]);
