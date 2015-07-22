'use strict';

/**
 * @ngdoc function
 * @name workoutClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the workoutClientApp
 */
angular.module('workoutClientApp')
  .controller('ProgramCtrl', ['$scope', '$routeParams', 'programs', function ($scope, $routeParams, programs) {
    // Action for the login form
    $scope.toggleEdit = toggleEdit;
    $scope.submit = submit;
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
          var c = nodes[i];
          c.$modelValue.ord = i;
        }
      }
    };

    if ($routeParams.id) {
      $scope.showEditButton = true;
      programs.Program($routeParams.id, function(data) {
        $scope.program = data.program;
        for (var i = 0; i < $scope.program.program_days_attributes.length; i++) {
          $scope.program.program_days_attributes[i].type = 'ceva';
        }
      });
    } else {
      $scope.editing = true;
      $scope.showEditButton = false;
      $scope.master = {};
    }

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
        programs.editProgram($scope.master, function(data) {
          $scope.program = $scope.master;
          $scope.toggleEdit(true);
        });
      } else {
        // programs

      }
    };
  }]);
