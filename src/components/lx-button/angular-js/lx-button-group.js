function lxButtonGroupDirective() {
    return {
        replace: true,
        restrict: 'E',
        template: '<div class="lx-button-group" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.button').directive('lxButtonGroup', lxButtonGroupDirective);

/////////////////////////////

export { lxButtonGroupDirective };
