import '../style/lx-list.scss';
import template from './lx-list.html';

/////////////////////////////

function lxListController($element, $scope) {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lxList = this;

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
    lxList.activeItemIndex = -1;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Increase active choice index on key down press.
     */
    function _nextItemOnKeyDown() {
        let nextItem = $element.find('.lx-list-item').eq(lxList.activeItemIndex + 1);

        if (nextItem.length === 0) {
            lxList.activeItemIndex = 0;

            nextItem = $element
                .find('.lx-list-item')
                .eq(lxList.activeItemIndex)
                .focus();
        } else {
            lxList.activeItemIndex++;
        }

        nextItem.focus();
    }

    /**
     * Decrease active choice index on key up press.
     */
    function _previousItemOnKeyUp() {
        let previousItem = $element.find('.lx-list-item').eq(lxList.activeItemIndex - 1);

        if (previousItem.length === 0) {
            lxList.activeItemIndex = $element.find('.lx-list-item').length - 1;

            previousItem = $element
                .find('.lx-list-item')
                .eq(lxList.activeItemIndex)
                .focus();
        } else {
            lxList.activeItemIndex--;
        }

        previousItem.focus();
    }

    /**
     * Handle key events on list focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if (!lxList.isClickable) {
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
        lxList.activeItemIndex = -1;
    });
}

/////////////////////////////

function lxListDirective() {
    return {
        bindToController: true,
        controller: lxListController,
        controllerAs: 'lxList',
        replace: true,
        restrict: 'E',
        scope: {
            isClickable: '=?lxIsClickable',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxList', lxListDirective);

/////////////////////////////

export { lxListDirective };
