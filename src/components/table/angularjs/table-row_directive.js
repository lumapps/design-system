import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './table-row.html';

/////////////////////////////

function TableRowController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The parent controller (table).
     *
     * @type {Object}
     */
    lumx.parentController = undefined;
}

/////////////////////////////

function TableRowDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls) {
        if (angular.isDefined(ctrls[2]) && ctrls[2]) {
            // eslint-disable-next-line prefer-destructuring
            ctrls[0].parentController = ctrls[1];
        }
    }

    return {
        bindToController: true,
        controller: TableRowController,
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}TableRow`, `^${COMPONENT_PREFIX}Table`, `?^${COMPONENT_PREFIX}TableBody`],
        restrict: 'E',
        scope: {
            isSelected: '=?lumxIsSelected',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableRow`, TableRowDirective);

/////////////////////////////

export { TableRowDirective };
