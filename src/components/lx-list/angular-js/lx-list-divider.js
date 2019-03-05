import { MODULE_NAME } from '@lumx/angularjs/lumx'

/////////////////////////////

function lxListDividerDirective() {
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
