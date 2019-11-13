import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './table-cell-body.html';

/////////////////////////////

function TableCellBodyDirective() {
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

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableCellBody`, TableCellBodyDirective);

/////////////////////////////

export { TableCellBodyDirective };
