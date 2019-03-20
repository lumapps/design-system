import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiMenuDown } from 'LumX/icons';

import template from './lx-chip.html';

/////////////////////////////

function lxChipController() {
    'ngInject';

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

    /**
     * The chip icons.
     *
     * @type {Object}
     */
    lxChip.icons = {
        mdiMenuDown,
    };

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
    'ngInject';

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
            hasDropdownIndicator: '=?lxHasDropdownIndicator',
            isDisabled: '=?ngDisabled',
            isSelected: '=?lxIsSelected',
            onAfterClick: '&?lxOnAfterClick',
            onBeforeClick: '&?lxOnBeforeClick',
            onClick: '&?lxOnClick',
            size: '@?lxSize',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            after: `?${COMPONENT_PREFIX}ChipAfter`,
            before: `?${COMPONENT_PREFIX}ChipBefore`,
            label: `${COMPONENT_PREFIX}ChipLabel`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.chip`).directive(`${COMPONENT_PREFIX}Chip`, lxChipDirective);

/////////////////////////////

export { lxChipDirective };
