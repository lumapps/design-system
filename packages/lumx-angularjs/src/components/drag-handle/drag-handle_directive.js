import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import { mdiDragVertical } from '@lumx/icons';

import template from './drag-handle.html';

/////////////////////////////

function DragHandleController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The expansion panel icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiDragVertical,
    };
}

/////////////////////////////

function DragHandleDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: DragHandleController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            theme: '@?lumxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.drag-handle`).directive(`${COMPONENT_PREFIX}DragHandle`, DragHandleDirective);

/////////////////////////////

export { DragHandleDirective };
