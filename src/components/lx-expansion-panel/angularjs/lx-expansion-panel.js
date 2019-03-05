import { MODULE_NAME } from '@lumx/angularjs/lumx'

import { mdiChevronDown, mdiChevronUp, mdiDragVertical } from '@lumx/icons';

import '../style/lx-expansion-panel.scss';
import template from './lx-expansion-panel.html';

/////////////////////////////

function lxExpansionPanelController($element, $scope, $timeout) {
    // eslint-disable-next-line consistent-this
    const lxExpansionPanel = this;

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
    lxExpansionPanel.hasFooter = false;

    /**
     * The expansion panel icons.
     *
     * @type {Object}
     */
    lxExpansionPanel.icons = {
        mdiChevronDown,
        mdiChevronUp,
        mdiDragVertical,
    };

    /**
     * Whether the expansion panel wrapper is displayed or not.
     *
     * @type {boolean}
     */
    lxExpansionPanel.isWrapperDisplayed = lxExpansionPanel.isOpen;

    /**
     * Whether the expansion panel wrapper is open or not.
     *
     * @type {boolean}
     */
    lxExpansionPanel.isWrapperOpen = lxExpansionPanel.isOpen;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the expansion panel wrapper max height.
     */
    function _setWrapperMaxHeight() {
        const expansionPanelWrapper = $element.find('.lx-expansion-panel__wrapper');
        const expansionPanelContainer = $element.find('.lx-expansion-panel__container');

        expansionPanelWrapper.css('max-height', expansionPanelContainer.outerHeight());
    }

    /**
     * Close the expansion panel wrapper.
     */
    function _close() {
        lxExpansionPanel.isWrapperOpen = false;

        $timeout(() => {
            lxExpansionPanel.isWrapperDisplayed = false;

            if (angular.isFunction(lxExpansionPanel.toggleCallback)) {
                lxExpansionPanel.toggleCallback();
            }

            if (angular.isFunction(lxExpansionPanel.closeCallback)) {
                lxExpansionPanel.closeCallback();
            }
        }, _TRANSITION_DURATION);
    }

    /**
     * Open the expansion panel wrapper.
     */
    function _open() {
        lxExpansionPanel.isWrapperDisplayed = true;
        lxExpansionPanel.isWrapperOpen = false;

        $timeout(() => {
            _setWrapperMaxHeight();

            lxExpansionPanel.isWrapperOpen = true;

            if (angular.isFunction(lxExpansionPanel.toggleCallback)) {
                lxExpansionPanel.toggleCallback();
            }

            if (angular.isFunction(lxExpansionPanel.openCallback)) {
                lxExpansionPanel.openCallback();
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
        if (!lxExpansionPanel.isOpen) {
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

        lxExpansionPanel.isOpen = !lxExpansionPanel.isOpen;
    }

    /////////////////////////////

    lxExpansionPanel.initWrapperMaxHeight = initWrapperMaxHeight;
    lxExpansionPanel.toggle = toggle;

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
    $scope.$watch('lxExpansionPanel.isOpen', function isOpenWatcher(isOpen, wasOpen) {
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

function lxExpansionPanelDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        ctrl.initWrapperMaxHeight();

        if (transclude.isSlotFilled('footer')) {
            ctrl.hasFooter = true;
        }
    }

    return {
        bindToController: true,
        controller: lxExpansionPanelController,
        controllerAs: 'lxExpansionPanel',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            closeCallback: '&?lxCloseCallback',
            isDraggable: '=?lxIsDraggable',
            isOpen: '=?lxIsOpen',
            openCallback: '&?lxOpenCallback',
            theme: '@?lxTheme',
            toggleCallback: '&?lxToggleCallback',
        },
        template,
        transclude: {
            content: 'lxExpansionPanelContent',
            footer: '?lxExpansionPanelFooter',
            header: 'lxExpansionPanelHeader',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.expansion-panel`).directive('lxExpansionPanel', lxExpansionPanelDirective);

/////////////////////////////

export { lxExpansionPanelDirective };
