import { mdiArrowDown, mdiArrowUp } from '@lumx/icons';

import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './table-cell-head.html';

/////////////////////////////

function TableCellHeadController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The table icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiArrowDown,
        mdiArrowUp,
    };
}

/////////////////////////////

function TableCellHeadDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableCellHeadController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lumxIcon',
            isSortable: '=?lumxIsSortable',
            scope: '@?lumxScope',
            sortOrder: '@?lumxSortOrder',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableCellHead`, TableCellHeadDirective);

/////////////////////////////

export { TableCellHeadDirective };
