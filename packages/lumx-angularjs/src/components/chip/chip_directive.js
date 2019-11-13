import { CSS_PREFIX } from '@lumx/core/src/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import { mdiMenuDown } from '@lumx/icons';

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

        const defaultProps = {
            color: 'dark',
        };

        if (!attrs.lumxColor) {
            el.addClass(`${CSS_PREFIX}-chip--color-${defaultProps.color}`);
        }

        attrs.$observe('lumxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*chip--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-chip--color-${color}`);
        });

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            const chipColor = theme === 'light' ? 'dark' : 'light';

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*chip--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-chip--color-${chipColor}`);
        });
    }

    return {
        bindToController: true,
        controller: ChipController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lumxColor',
            customColors: '=?lumxCustomColors',
            hasDropdownIndicator: '=?lumxHasDropdownIndicator',
            isDisabled: '=?ngDisabled',
            isSelected: '=?lumxIsSelected',
            onAfterClick: '&?lumxOnAfterClick',
            onBeforeClick: '&?lumxOnBeforeClick',
            onClick: '&?lumxOnClick',
            size: '@?lumxSize',
            theme: '@?lumxTheme',
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
