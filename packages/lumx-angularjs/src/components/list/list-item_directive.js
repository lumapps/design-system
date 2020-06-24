import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './list-item.html';

/////////////////////////////

function ListItemController($element, $scope) {
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
        size: 'regular',
    };

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
    lx.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasBefore = false;

    /**
     * Whether the directive has content slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasContent = false;

    /**
     * The parent controller (list).
     *
     * @type {Object}
     */
    lx.parentController = undefined;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Register item index as active index to the list.
     */
    function _registerIndex() {
        if (angular.isUndefined(lx.parentController)) {
            return;
        }

        lx.parentController.activeItemIndex = $element.index(`.${CSS_PREFIX}-list-item`);
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get list item classes.
     *
     * @return {Array} The list of list item classes.
     */
    function getClasses() {
        const classes = [];

        const size = lx.size ? lx.size : _DEFAULT_PROPS.size;

        classes.push(`${CSS_PREFIX}-list-item--size-${size}`);

        return classes;
    }

    /**
     * Get list item link classes.
     *
     * @return {Array} The list of list item classes.
     */
    function getLinkClasses() {
        const linkClasses = [];

        if (lx.isSelected) {
            linkClasses.push(`${CSS_PREFIX}-list-item__link--is-selected`);
        }

        return linkClasses;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.getLinkClasses = getLinkClasses;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Register item index as active index to the list on focus.
     */
    $element.on('focus', _registerIndex);

    /**
     * Unbind event listener on destroy.
     */
    $scope.$on('$destroy', () => {
        $element.off('focus', _registerIndex);
    });
}

/////////////////////////////

function ListItemDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        if (transclude.isSlotFilled('before')) {
            ctrls[0].hasBefore = true;
        }

        if (transclude.isSlotFilled('content')) {
            ctrls[0].hasContent = true;
        }

        if (transclude.isSlotFilled('after')) {
            ctrls[0].hasAfter = true;
        }

        if (angular.isDefined(ctrls[1]) && ctrls[1]) {
            // eslint-disable-next-line prefer-destructuring
            ctrls[0].parentController = ctrls[1];
        }
    }

    return {
        bindToController: true,
        controller: ListItemController,
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxListItem', '?^lxList'],
        restrict: 'E',
        scope: {
            isSelected: '=?lxIsSelected',
            size: '@?lxSize',
        },
        template,
        transclude: {
            after: '?lxListItemAfter',
            before: '?lxListItemBefore',
            content: '?lxListItemContent',
        },
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListItem', ListItemDirective);

/////////////////////////////

export { ListItemDirective };
