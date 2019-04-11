import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiArrowDown, mdiArrowUp } from 'LumX/icons';

import template from './table-cell.html';

/////////////////////////////

function TableCellController() {
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

function TableCellDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableCellController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lumxIcon',
            isSortable: '=?lumxIsSortable',
            sortOrder: '@?lumxSortOrder',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableCell`, TableCellDirective);

/////////////////////////////

export { TableCellDirective };
