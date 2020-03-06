import { CSS_PREFIX, DOWN_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE } from '@lumx/core/js/constants';

import template from './list.html';

/////////////////////////////

function ListController($element, $scope) {
    'ngInject';

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
        itemPadding: 'big',
    };

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
    lx.activeItemIndex = -1;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Increase active choice index on down arrow key down.
     */
    function _nextItemOnKeyDown() {
        let nextItem = $element.find(`.${CSS_PREFIX}-list-item`).eq(lx.activeItemIndex + 1);

        if (nextItem.length === 0) {
            lx.activeItemIndex = 0;

            nextItem = $element
                .find(`.${CSS_PREFIX}-list-item`)
                .eq(lx.activeItemIndex)
                .focus();
        } else {
            lx.activeItemIndex++;
        }

        nextItem.focus();
    }

    /**
     * Decrease active choice index on up arrow key down.
     */
    function _previousItemOnKeyUp() {
        let previousItem = $element.find(`.${CSS_PREFIX}-list-item`).eq(lx.activeItemIndex - 1);

        if (previousItem.length === 0) {
            lx.activeItemIndex = $element.find(`.${CSS_PREFIX}-list-item`).length - 1;

            previousItem = $element
                .find(`.${CSS_PREFIX}-list-item`)
                .eq(lx.activeItemIndex)
                .focus();
        } else {
            lx.activeItemIndex--;
        }

        previousItem.focus();
    }

    /**
     * Handle key events on list focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyDown(evt) {
        if (!lx.isClickable) {
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
        lx.activeItemIndex = -1;
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get list classes.
     *
     * @return {Array} The list of list classes.
     */
    function getClasses() {
        const classes = [];

        if (lx.isClickable) {
            classes.push(`${CSS_PREFIX}-list--is-clickable`);

            const itemPadding = lx.itemPadding ? lx.itemPadding : _DEFAULT_PROPS.itemPadding;
            classes.push(`${CSS_PREFIX}-list--item-padding-${itemPadding}`);
        }

        if (lx.customColors) {
            classes.push(`${CSS_PREFIX}-custom-colors`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Navigate through items on up and down arrow key down.
     */
    $element.on('keydown', _onKeyDown).on('focus', _resetActiveItemIndex);

    /**
     * Unbind event listeners on destroy.
     */
    $scope.$on('$destroy', () => {
        $element.off('keydown', _onKeyDown).off('focus', _resetActiveItemIndex);
    });
}

/////////////////////////////

function ListDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ListController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lxCustomColors',
            isClickable: '=?lxIsClickable',
            itemPadding: '@?lxItemPadding',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxList', ListDirective);

/////////////////////////////

export { ListDirective };
