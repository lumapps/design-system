import { mdiDragVertical } from '@lumx/icons';

import template from './drag-handle.html';

/////////////////////////////

function DragHandleController() {
    'ngInject';

    const lx = this;

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
    lx.icons = {
        mdiDragVertical,
    };
}

/////////////////////////////

function DragHandleDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: DragHandleController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            theme: '@?lxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.drag-handle').directive('lxDragHandle', DragHandleDirective);

/////////////////////////////

export { DragHandleDirective };
