import { mdiChevronDown, mdiChevronUp, mdiDragVertical } from '@lumx/icons';

import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './expansion-panel.html';

/////////////////////////////

function ExpansionPanelController($element, $scope, $timeout) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The default props.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _DEFAULT_PROPS = {
        theme: 'light',
        variant: 'boxed',
    };

    /**
     * The expansion panel toggle transition duration.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _TRANSITION_DURATION = 400;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has footer slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasFooter = false;

    /**
     * Whether the directive has header slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasHeader = false;

    /**
     * The expansion panel icons.
     *
     * @type {Object}
     */
    lx.icons = {
        mdiChevronDown,
        mdiChevronUp,
        mdiDragVertical,
    };

    /**
     * Whether the directive has drag handle slot filled or not.
     *
     * @type {boolean}
     */
    lx.isDraggable = false;

    /**
     * Whether the expansion panel wrapper is displayed or not.
     *
     * @type {boolean}
     */
    lx.isWrapperDisplayed = lx.isOpen;

    /**
     * Whether the expansion panel wrapper is open or not.
     *
     * @type {boolean}
     */
    lx.isWrapperOpen = lx.isOpen;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the expansion panel wrapper max height.
     */
    function _setWrapperMaxHeight() {
        const expansionPanelWrapper = $element.find(`.${CSS_PREFIX}-expansion-panel__wrapper`);
        const expansionPanelContainer = $element.find(`.${CSS_PREFIX}-expansion-panel__container`);

        expansionPanelWrapper.css('max-height', expansionPanelContainer.outerHeight());
    }

    /**
     * Close the expansion panel wrapper.
     */
    function _close() {
        lx.isWrapperOpen = false;

        $timeout(() => {
            lx.isWrapperDisplayed = false;

            if (angular.isFunction(lx.toggleCallback)) {
                lx.toggleCallback();
            }

            if (angular.isFunction(lx.closeCallback)) {
                lx.closeCallback();
            }
        }, _TRANSITION_DURATION);
    }

    /**
     * Open the expansion panel wrapper.
     */
    function _open() {
        lx.isWrapperDisplayed = true;
        lx.isWrapperOpen = false;

        $timeout(() => {
            _setWrapperMaxHeight();

            lx.isWrapperOpen = true;

            if (angular.isFunction(lx.toggleCallback)) {
                lx.toggleCallback();
            }

            if (angular.isFunction(lx.openCallback)) {
                lx.openCallback();
            }
        });
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get expansion panel classes.
     *
     * @return {Array} The list of expansion panel classes.
     */
    function getClasses() {
        const classes = [];

        const state = lx.isWrapperOpen ? 'open' : 'close';
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        const variant = lx.variant ? lx.variant : _DEFAULT_PROPS.variant;

        classes.push(`${CSS_PREFIX}-expansion-panel--is-${state}`);
        classes.push(`${CSS_PREFIX}-expansion-panel--theme-${theme}`);
        classes.push(`${CSS_PREFIX}-expansion-panel--variant-${variant}`);

        if (lx.hasHeader) {
            classes.push(`${CSS_PREFIX}-expansion-panel--has-header`);
        }

        if (lx.hasHeaderDivider) {
            classes.push(`${CSS_PREFIX}-expansion-panel--has-header-divider`);
        }

        if (lx.isDraggable) {
            classes.push(`${CSS_PREFIX}-expansion-panel--is-draggable`);
        }

        return classes;
    }

    /**
     * Initialize the expansion panel wrapper max height.
     */
    function initWrapperMaxHeight() {
        if (!lx.isOpen) {
            return;
        }

        $timeout(_setWrapperMaxHeight);
    }

    /**
     * Toggle the expansion panel wrapper animation.
     *
     * @param {Event} [evt] The click event.
     */
    function toggle(evt) {
        if (angular.isDefined(evt)) {
            evt.stopPropagation();
        }

        lx.isOpen = !lx.isOpen;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.initWrapperMaxHeight = initWrapperMaxHeight;
    lx.toggle = toggle;

    /////////////////////////////
    //                         //
    //        Watchers         //
    //                         //
    /////////////////////////////

    /**
     * Watch for any changes of the expansion panel state to toggle the expansion panel wrapper animation.
     *
     * @param {boolean} isOpen Whether the expansion panel is open or not.
     */
    $scope.$watch('lx.isOpen', function isOpenWatcher(isOpen, wasOpen) {
        if (isOpen !== wasOpen) {
            if (isOpen) {
                _open();
            } else {
                _close();
            }
        }
    });
}

/////////////////////////////

function ExpansionPanelDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        ctrl.initWrapperMaxHeight();

        if (transclude.isSlotFilled('dragHandle')) {
            ctrl.isDraggable = true;
        }

        if (transclude.isSlotFilled('header')) {
            ctrl.hasHeader = true;
        }

        if (transclude.isSlotFilled('footer')) {
            ctrl.hasFooter = true;
        }
    }

    return {
        bindToController: true,
        controller: ExpansionPanelController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            closeCallback: '&?lxCloseCallback',
            hasHeaderDivider: '=?lxHasHeaderDivider',
            isOpen: '=?lxIsOpen',
            label: '@?lxLabel',
            openCallback: '&?lxOpenCallback',
            theme: '@?lxTheme',
            toggleCallback: '&?lxToggleCallback',
            variant: '@?lxVariant',
        },
        template,
        transclude: {
            content: 'lxExpansionPanelContent',
            dragHandle: '?lxExpansionPanelDragHandle',
            footer: '?lxExpansionPanelFooter',
            header: '?lxExpansionPanelHeader',
        },
    };
}

/////////////////////////////

angular.module('lumx.expansion-panel').directive('lxExpansionPanel', ExpansionPanelDirective);

/////////////////////////////

export { ExpansionPanelDirective };
