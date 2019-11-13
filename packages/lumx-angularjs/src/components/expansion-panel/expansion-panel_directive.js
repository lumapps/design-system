import { CSS_PREFIX } from '@lumx/core/src/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import { mdiChevronDown, mdiChevronUp, mdiDragVertical } from '@lumx/icons';

import template from './expansion-panel.html';

/////////////////////////////

function ExpansionPanelController($element, $scope, $timeout) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

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
    lumx.hasFooter = false;

    /**
     * Whether the directive has header slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasHeader = false;

    /**
     * The expansion panel icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiChevronDown,
        mdiChevronUp,
        mdiDragVertical,
    };

    /**
     * Whether the directive has drag handle slot filled or not.
     *
     * @type {boolean}
     */
    lumx.isDraggable = false;

    /**
     * Whether the expansion panel wrapper is displayed or not.
     *
     * @type {boolean}
     */
    lumx.isWrapperDisplayed = lumx.isOpen;

    /**
     * Whether the expansion panel wrapper is open or not.
     *
     * @type {boolean}
     */
    lumx.isWrapperOpen = lumx.isOpen;

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
        lumx.isWrapperOpen = false;

        $timeout(() => {
            lumx.isWrapperDisplayed = false;

            if (angular.isFunction(lumx.toggleCallback)) {
                lumx.toggleCallback();
            }

            if (angular.isFunction(lumx.closeCallback)) {
                lumx.closeCallback();
            }
        }, _TRANSITION_DURATION);
    }

    /**
     * Open the expansion panel wrapper.
     */
    function _open() {
        lumx.isWrapperDisplayed = true;
        lumx.isWrapperOpen = false;

        $timeout(() => {
            _setWrapperMaxHeight();

            lumx.isWrapperOpen = true;

            if (angular.isFunction(lumx.toggleCallback)) {
                lumx.toggleCallback();
            }

            if (angular.isFunction(lumx.openCallback)) {
                lumx.openCallback();
            }
        });
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Initialize the expansion panel wrapper max height.
     */
    function initWrapperMaxHeight() {
        if (!lumx.isOpen) {
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

        lumx.isOpen = !lumx.isOpen;
    }

    /////////////////////////////

    lumx.initWrapperMaxHeight = initWrapperMaxHeight;
    lumx.toggle = toggle;

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
    $scope.$watch('lumx.isOpen', function isOpenWatcher(isOpen, wasOpen) {
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
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            closeCallback: '&?lumxCloseCallback',
            isOpen: '=?lumxIsOpen',
            label: '@?lumxLabel',
            openCallback: '&?lumxOpenCallback',
            theme: '@?lumxTheme',
            toggleCallback: '&?lumxToggleCallback',
            variant: '@?lumxVariant',
        },
        template,
        transclude: {
            content: `${COMPONENT_PREFIX}ExpansionPanelContent`,
            dragHandle: `?${COMPONENT_PREFIX}ExpansionPanelDragHandle`,
            footer: `?${COMPONENT_PREFIX}ExpansionPanelFooter`,
            header: `?${COMPONENT_PREFIX}ExpansionPanelHeader`,
        },
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.expansion-panel`)
    .directive(`${COMPONENT_PREFIX}ExpansionPanel`, ExpansionPanelDirective);

/////////////////////////////

export { ExpansionPanelDirective };
