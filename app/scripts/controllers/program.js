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
  }]);
