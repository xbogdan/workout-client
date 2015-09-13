angular.module('workoutClientApp')
  .directive('editDayBtn', function($compile) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="program-item-action edit-btn show-global" ng-click="edit(); $event.stopPropagation()"><i class="glyphicon glyphicon-pencil"></i></div>',
      controller: function($scope, $element) {
        $scope.edit = function() {
          var $li = $element.closest('.program-item');
          $scope.programItem = $element.closest('.program-item-text');
          if ($li.find('.edit-box').length) {
            toggle();
          } else {
            $scope.programItem.toggleClass('hidden');
            var editBox = $compile('<div class="edit-box"><input type="text" ng-model="day.name" ng-model-options="{debounce: { \'default\': 500 }}">' +
                                   '<div ng-click="close()" class="glyphicon glyphicon-check edit-btn"></div></div>')($scope);
            $scope.programItem.after(editBox);
            $scope.editBox = $li.find('.edit-box');
          }
        };
        $scope.close = function() {
          toggle();
        };
        function toggle() {
          $scope.editBox.toggleClass('hidden');
          $scope.programItem.toggleClass('hidden');
        }
      }
    };
  });
