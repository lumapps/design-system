import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './table-row.html';

/////////////////////////////

function TableRowDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableRow`, TableRowDirective);

/////////////////////////////

export { TableRowDirective };
