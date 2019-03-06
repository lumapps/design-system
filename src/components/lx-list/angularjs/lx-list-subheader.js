import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

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
