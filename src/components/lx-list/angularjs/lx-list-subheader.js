import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxListSubheaderDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: '<li class="lx-list-subheader" ng-transclude></li>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive(`${COMPONENT_PREFIX}ListSubheader`, lxListSubheaderDirective);

/////////////////////////////

export { lxListSubheaderDirective };
