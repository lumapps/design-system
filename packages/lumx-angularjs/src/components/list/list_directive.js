import { CSS_PREFIX, DOWN_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './list.html';

/////////////////////////////

function lumxListController($element, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;

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
        let nextItem = $element.find(`.${CSS_PREFIX}-list-item`).eq(lumx.activeItemIndex + 1);

        if (nextItem.length === 0) {
            lumx.activeItemIndex = 0;

            nextItem = $element
                .find(`.${CSS_PREFIX}-list-item`)
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
        let previousItem = $element.find(`.${CSS_PREFIX}-list-item`).eq(lumx.activeItemIndex - 1);

        if (previousItem.length === 0) {
            lumx.activeItemIndex = $element.find(`.${CSS_PREFIX}-list-item`).length - 1;

            previousItem = $element
                .find(`.${CSS_PREFIX}-list-item`)
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

        if (evt.keyCode === DOWN_KEY_CODE) {
            _nextItemOnKeyDown();
            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        } else if (evt.keyCode === UP_KEY_CODE) {
            _previousItemOnKeyUp();
            $scope.$apply();

            evt.preventDefault();
            evt.stopPropagation();
        } else if (evt.keyCode === TAB_KEY_CODE) {
            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    /**
     * Reset active item index.
     */
    function _resetActiveItemIndex() {
        lumx.activeItemIndex = -1;
    }

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Navigate through items on up and down arrow key press.
     */
    $element.on('keydown keypress', _onKeyPress).on('focus', _resetActiveItemIndex);

    /**
     * Unbind event listeners on destroy.
     */
    $scope.$on('$destroy', () => {
        $element.off('keydown keypress', _onKeyPress).off('focus', _resetActiveItemIndex);
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
            customColors: '=?lumxCustomColors',
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
