import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxListDividerDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: '<li class="lx-list-divider"></li>',
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive(`${COMPONENT_PREFIX}ListDivider`, lxListDividerDirective);

/////////////////////////////

export { lxListDividerDirective };
