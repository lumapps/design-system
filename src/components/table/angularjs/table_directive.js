import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './table.html';

/////////////////////////////

function TableController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function TableDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            hasBefore: '=?lumxHasBefore',
            hasDividers: '=?lumxHasDividers',
            isClickable: '=?lumxIsClickable',
            theme: '@?lumxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}Table`, TableDirective);

/////////////////////////////

export { TableDirective };
