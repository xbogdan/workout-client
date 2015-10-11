'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:ExercisesController
 * @description
 * # ExercisesController
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ExercisesController', ['$scope', '$location', '$rootScope', 'ProgramsService', function ($scope, $location, $rootScope, ProgramsService) {

    $scope.form = { name: '', muscle_group_id: "0" };
    $scope.userID = $rootScope.globals.currentUser.id;

    initMuscleGroups();
    initExercises();

    function initExercises() {
      ProgramsService.Exercises({group: 1}, function(data, status) {
        $scope.exercises = data.exercises;
      });
    }

    function initMuscleGroups() {
      ProgramsService.MuscleGroups(function(data, status) {
        $scope.muscleGroups = data.groups;
      });
    }
    $scope.deleteExercise = function(ex) {
      ProgramsService.deleteExercise(ex.id, function(data, status) {
        if (status === 200) {
          initExercises();
        } else {
          alert(data.error);
        }
      });
    };
    $scope.submit = function() {
      ProgramsService.createExercise({name: $scope.form.name, muscle_group_id: $scope.form.muscle_group_id}, function(data, status) {
        if (status === 201) {
          initExercises();
        }
        if (status !== 201) {
          alert(data.error);
        }
      });
    };
  }]);
