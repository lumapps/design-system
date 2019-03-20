import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiMenuDown } from 'LumX/icons';

import template from './chip.html';

/////////////////////////////

function ChipController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

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
    lumx.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasBefore = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasLabel = false;

    /**
     * The chip icons.
     *
     * @type {Object}
     */
    lumx.icons = {
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
        if (!angular.isFunction(lumx.onAfterClick)) {
            return;
        }

        evt.stopPropagation();

        lumx.onAfterClick();
    }

    /**
     * Handle given function on before area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnBeforeClick(evt) {
        if (!angular.isFunction(lumx.onBeforeClick)) {
            return;
        }

        evt.stopPropagation();

        lumx.onBeforeClick();
    }

    /**
     * Handle given function on the whole area click.
     *
     * @param {Event} evt The click event.
     */
    function handleOnClick(evt) {
        if (!angular.isFunction(lumx.onClick)) {
            return;
        }

        lumx.onClick({ $event: evt });
    }

    /////////////////////////////

    lumx.handleOnAfterClick = handleOnAfterClick;
    lumx.handleOnBeforeClick = handleOnBeforeClick;
    lumx.handleOnClick = handleOnClick;
}

/////////////////////////////

function ChipDirective() {
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
        controller: ChipController,
        controllerAs: 'lumx',
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

angular.module(`${MODULE_NAME}.chip`).directive(`${COMPONENT_PREFIX}Chip`, ChipDirective);

/////////////////////////////

export { ChipDirective };
