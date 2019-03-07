import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxButtonGroupDirective() {
    'ngInject';

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
