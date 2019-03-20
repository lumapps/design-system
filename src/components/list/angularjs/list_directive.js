import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './list.html';

/////////////////////////////

function lumxListController($element, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The down key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _DOWN_KEY_CODE = 40;

    /**
     * The tab key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _TAB_KEY_CODE = 9;

    /**
     * The up key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _UP_KEY_CODE = 38;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The active item index useful when navigating with keybord arrow keys.
     *
     * @type {number}
     */
    lumx.activeItemIndex = -1;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Increase active choice index on key down press.
     */
    function _nextItemOnKeyDown() {
        let nextItem = $element.find(`.${COMPONENT_PREFIX}-list-item`).eq(lumx.activeItemIndex + 1);

        if (nextItem.length === 0) {
            lumx.activeItemIndex = 0;

            nextItem = $element
                .find(`.${COMPONENT_PREFIX}-list-item`)
                .eq(lumx.activeItemIndex)
                .focus();
        } else {
            lumx.activeItemIndex++;
        }

        nextItem.focus();
    }

    /**
     * Decrease active choice index on key up press.
     */
    function _previousItemOnKeyUp() {
        let previousItem = $element.find(`.${COMPONENT_PREFIX}-list-item`).eq(lumx.activeItemIndex - 1);

        if (previousItem.length === 0) {
            lumx.activeItemIndex = $element.find(`.${COMPONENT_PREFIX}-list-item`).length - 1;

            previousItem = $element
                .find(`.${COMPONENT_PREFIX}-list-item`)
                .eq(lumx.activeItemIndex)
                .focus();
        } else {
            lumx.activeItemIndex--;
        }

        previousItem.focus();
    }

    /**
     * Handle key events on list focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if (!lumx.isClickable) {
            return;
        }

        if (evt.keyCode === _DOWN_KEY_CODE) {
            _nextItemOnKeyDown();
            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        } else if (evt.keyCode === _UP_KEY_CODE) {
            _previousItemOnKeyUp();
            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        } else if (evt.keyCode === _TAB_KEY_CODE) {
            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    $element.on('keydown keypress', _onKeyPress).on('focus', () => {
        lumx.activeItemIndex = -1;
    });
}

/////////////////////////////

function ListDirective() {
    return {
        bindToController: true,
        controller: lumxListController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            isClickable: '=?lumxIsClickable',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive(`${COMPONENT_PREFIX}List`, ListDirective);

/////////////////////////////

export { ListDirective };
