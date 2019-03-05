import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-chip.scss';
import template from './lx-chip.html';

/////////////////////////////

function lxChipController() {
    // eslint-disable-next-line consistent-this
    const lxChip = this;

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
    lxChip.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lxChip.hasBefore = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lxChip.hasLabel = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Handle given function on after area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnAfterClick(evt) {
        if (!angular.isFunction(lxChip.onAfterClick)) {
            return;
        }

        evt.stopPropagation();

        lxChip.onAfterClick();
    }

    /**
     * Handle given function on before area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnBeforeClick(evt) {
        if (!angular.isFunction(lxChip.onBeforeClick)) {
            return;
        }

        evt.stopPropagation();

        lxChip.onBeforeClick();
    }

    /**
     * Handle given function on the whole area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnClick(evt) {
        if (!angular.isFunction(lxChip.onClick)) {
            return;
        }

        lxChip.onClick({ $event: evt });
    }

    /////////////////////////////

    lxChip.handleOnAfterClick = handleOnAfterClick;
    lxChip.handleOnBeforeClick = handleOnBeforeClick;
    lxChip.handleOnClick = handleOnClick;
}

/////////////////////////////

function lxChipDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('after')) {
            ctrl.hasAfter = true;
        }

        if (transclude.isSlotFilled('before')) {
            ctrl.hasBefore = true;
        }

        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
        }
    }

    return {
        bindToController: true,
        controller: lxChipController,
        controllerAs: 'lxChip',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            isActive: '=?lxIsActive',
            isDisabled: '=?ngDisabled',
            onAfterClick: '&?lxOnAfterClick',
            onBeforeClick: '&?lxOnBeforeClick',
            onClick: '&?lxOnClick',
            size: '@?lxSize',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            after: '?lxChipAfter',
            before: '?lxChipBefore',
            label: 'lxChipLabel',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.chip`).directive('lxChip', lxChipDirective);

/////////////////////////////

export { lxChipDirective };
