import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import '../style/lx-toolbar.scss';
import template from './lx-toolbar.html';

/////////////////////////////

function lxToolbarController() {
    // eslint-disable-next-line consistent-this
    const lxToolbar = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has after slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasBefore = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasLabel = false;
}

/////////////////////////////

function lxToolbarDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('before')) {
            ctrl.hasBefore = true;
            el.addClass('lx-toolbar--has-before');
        }

        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
            el.addClass('lx-toolbar--has-label');
        }

        if (transclude.isSlotFilled('after')) {
            ctrl.hasAfter = true;
            el.addClass('lx-toolbar--has-after');
        }
    }

    return {
        bindToController: true,
        controller: lxToolbarController,
        controllerAs: 'lxToolbar',
        link,
        replace: true,
        restrict: 'E',
        template,
        transclude: {
            after: '?lxToolbarAfter',
            before: '?lxToolbarBefore',
            label: '?lxToolbarLabel',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.toolbar`).directive('lxToolbar', lxToolbarDirective);

/////////////////////////////

export { lxToolbarDirective };
