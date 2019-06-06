import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './side-navigation.html';

/////////////////////////////

function SideNavigationDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        scope: {},
        template,
        transclude: true,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.side-navigation`)
    .directive(`${COMPONENT_PREFIX}SideNavigation`, SideNavigationDirective);

/////////////////////////////

export { SideNavigationDirective };
