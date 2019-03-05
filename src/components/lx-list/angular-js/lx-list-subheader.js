import { MODULE_NAME } from '@lumx/angularjs/lumx'

/////////////////////////////

function lxListSubheaderDirective() {
    return {
        replace: true,
        restrict: 'E',
        template: '<li class="lx-list-subheader" ng-transclude></li>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive('lxListSubheader', lxListSubheaderDirective);

/////////////////////////////

export { lxListSubheaderDirective };
