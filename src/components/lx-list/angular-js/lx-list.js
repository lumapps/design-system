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
        const nextItem = $element.find('.lx-list-item').eq(lxList.activeItemIndex + 1);

        if (nextItem.length === 0) {
            return;
        }

        lxList.activeItemIndex++;
        nextItem.focus();
    }

    /**
     * Decrease active choice index on key up press.
     */
    function _previousItemOnKeyUp() {
        if (lxList.activeItemIndex < 1) {
            return;
        }

        const previousItem = $element.find('.lx-list-item').eq(lxList.activeItemIndex - 1);

        if (previousItem.length === 0) {
            return;
        }

        lxList.activeItemIndex--;
        previousItem.focus();
    }

    /**
     * Handle key events on list focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if (evt.keyCode === _DOWN_KEY_CODE) {
            _nextItemOnKeyDown();
            $scope.$apply();

            evt.preventDefault();
        } else if (evt.keyCode === _UP_KEY_CODE) {
            _previousItemOnKeyUp();
            $scope.$apply();

            evt.preventDefault();
        }

        evt.stopPropagation();
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
    function link(scope, el, attrs) {
        if (attrs.lxFocusOnInit) {
            el.focus();
        }
    }

    return {
        bindToController: true,
        controller: lxListController,
        controllerAs: 'lxList',
        link,
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
