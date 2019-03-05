import { MODULE_NAME } from '@lumx/angularjs/lumx'

/////////////////////////////

function lxButtonGroupDirective() {
    return {
        replace: true,
        restrict: 'E',
        template: '<div class="lx-button-group" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.button`).directive('lxButtonGroup', lxButtonGroupDirective);

/////////////////////////////

export { lxButtonGroupDirective };
