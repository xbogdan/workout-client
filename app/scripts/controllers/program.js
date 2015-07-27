'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ProgramCtrl
 * @description
 * # ProgramCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramCtrl', ['$scope', '$routeParams', 'ProgramsService', function ($scope, $routeParams, ProgramsService) {
    // Action for the login form
    $scope.toggleEdit = toggleEdit;
    $scope.submit = submit;
    $scope.toggleDestroyElement = toggleDestroyElement;
    $scope.addExercise = addExercise;
    $scope.addSet = addSet;
    $scope.addDay = addDay;
    $scope.exerciseKeyUp = exerciseKeyUp;
    $scope.exerciseOnChange = exerciseOnChange;

    function exerciseKeyUp(event, model) {
      var value = event.target.value;
      var datalist = $(event.target.list);
      var exercises_found = [];

      datalist.empty();
      ProgramsService.Exercises(value, function(data, status) {
        for (var i = 0; i < data.exercises.length; i++) {
          var ex = data.exercises[i];
          var option = document.createElement('option');
          option.value = ex.name;
          option.dataset.id = ex.id;
          exercises_found.push(option);
          if (value === ex.name) {
            model.$modelValue.exercise_id = ex.id;
          } else {
            model.$modelValue.exercise_id = null;
          }
        };
        datalist.html(exercises_found);
      });
    };

    function exerciseOnChange(model) {
      var exercise = $('#json-datalist option[value="'+model.$modelValue.name+'"]');
      if (exercise.length) {
        var exercise_id = exercise.attr('data-id');
        model.$modelValue.exercise_id = exercise_id;
      }
    };

    $scope.treeOptions = {
      accept: function(sourceNode, destNodes, destIndex) {
        var sourceType = sourceNode.$element.attr('data-type');
        var destType = destNodes.$element.attr('data-type');
        return (sourceType == destType);
      },
      dropped: function(e) {
        e.source.nodeScope.$modelValue.ord = e.dest.index
        var nodes = e.dest.nodesScope.childNodes();
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].$modelValue.ord = i;
        }
      }
    };

    if ($routeParams.id) {
      $scope.showEditButton = true;
      ProgramsService.Program($routeParams.id, function(data) {
        $scope.program = data.program;
      });
    } else {
      $scope.editing = true;
      $scope.showEditButton = false;
      $scope.master = {};
    }

    function toggleDestroyElement(element, event) {
      if (typeof element._destroy === 'undefined' || element._destroy === false) {
        $(event.target).html('cancel').closest('li').addClass('destroy');
        element._destroy = true;
      } else if (element._destroy === true) {
        $(event.target).html('remove').closest('li').removeClass('destroy');
        element._destroy = false;
      }
    };

    function toggleEdit(updated) {
      $scope.editing = !$scope.editing;
      $scope.master = $scope.program;
      $scope.masterCopy = angular.copy($scope.master);
      if (!updated) {
        $scope.master = angular.copy($scope.masterCopy);
      }
    };

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
        // ProgramsService

      }
    };

    function addExercise(dayIndex) {
      if (typeof $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes === 'undefined') {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes = [];
      }
      $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes.push({});
      var exIndex = $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes.length - 1;
      addSet(dayIndex, exIndex);

      $scope.master = $scope.program;
    };

    function addSet(dayIndex, exIndex) {
      if (typeof $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes === 'undefined') {
        $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes = [];
      }
      $scope.program.program_days_attributes[dayIndex].program_day_exercises_attributes[exIndex].program_day_exercise_sets_attributes.push({});

      $scope.master = $scope.program;
    };

    function addDay() {
      $scope.program.program_days_attributes.push({});
      var dayIndex = $scope.program.program_days_attributes.length - 1;
      $scope.program.program_days_attributes[dayIndex].ord = $scope.program.program_days_attributes[dayIndex-1].ord + 1;
      addExercise(dayIndex);
      
      $scope.master = $scope.program;
    };
  }]);
