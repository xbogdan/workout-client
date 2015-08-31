angular.module('workoutClientApp')
  .directive('onFinishRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$eval(attr.onFinishRender);
          });
        }
      }
    }
});

angular.module('workoutClientApp')
  .directive('onRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        $timeout(function () {
          console.log('ceva');
          scope.$eval(attr.onFinishRender);
        });
      }
    }
});
