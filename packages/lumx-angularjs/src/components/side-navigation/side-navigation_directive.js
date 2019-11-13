import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './side-navigation.html';

/////////////////////////////

function SideNavigationController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function SideNavigationDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: SideNavigationController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lumxCustomColors',
        },
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
