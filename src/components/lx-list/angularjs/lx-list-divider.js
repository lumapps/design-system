import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

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

angular.module(`${MODULE_NAME}.list`).directive('lxListDivider', lxListDividerDirective);

/////////////////////////////

export { lxListDividerDirective };
