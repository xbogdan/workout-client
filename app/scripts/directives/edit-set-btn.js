'use strict';

angular.module('workoutClientApp')
  .directive('editSetBtn', function($compile) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="program-item-action edit-btn show-global" ng-click="edit(); $event.stopPropagation()"><i class="glyphicon glyphicon-pencil"></i></div>',
      controller: function($scope, $element) {
        $scope.edit = function() {
          closeActive();

          var $li = $element.closest('.program-item');
          $scope.programItem = $element.closest('.program-item-text');
          if ($li.find('.edit-box').length) {
            toggle();
          } else {
            $scope.programItem.toggleClass('hidden');
            var editBox = $compile(
              '<div class="edit-box">' +
                '<input type="text" ng-model="set.reps" ng-model-options="{debounce: { \'default\': 500 }}">' +
                '<small>reps</small>' +
                '<div ng-click="close()" class="glyphicon glyphicon-check edit-btn"></div>' +
              '</div>'
            )($scope);
            $scope.programItem.after(editBox);
            $scope.editBox = editBox;
            focusInput();
          }
        };
        $scope.close = function() {
          toggle();
        };
        function toggle() {
          if ($scope.editBox.hasClass('hidden')) {
            $scope.editBox.removeClass('hidden');
            // focusInput();
          } else {
            $scope.editBox.addClass('hidden');
          }
          $scope.programItem.toggleClass('hidden');
        }
        function closeActive() {
          $('.program-tree .edit-box:not(.hidden)').addClass('hidden');
          $('.program-tree .program-item-text.hidden').removeClass('hidden');
        }
        function focusInput() {
          setTimeout(function() {
            $scope.editBox.find('input').focus();
          }, 0);
        }
      }
    };
  });
