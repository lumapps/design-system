import template from './lx-list-item.html';

/////////////////////////////

function lxListItemController() {
    // eslint-disable-next-line consistent-this
    const lxListItem = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Wether the directive has content slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasContent = false;

    /**
     * Wether the directive has primary slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasPrimary = false;

    /**
     * Wether the directive has secondary slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasSecondary = false;
}

/////////////////////////////

function lxListItemDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('primary')) {
            ctrl.hasPrimary = true;
        }

        if (transclude.isSlotFilled('content')) {
            ctrl.hasContent = true;
        }

        if (transclude.isSlotFilled('secondary')) {
            ctrl.hasSecondary = true;
        }
    }

    return {
        bindToController: true,
        controller: lxListItemController,
        controllerAs: 'lxListItem',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lxIcon',
            isClickable: '=?lxIsClickable',
        },
        template,
        transclude: {
            content: '?lxListItemContent',
            primary: '?lxListItemPrimary',
            secondary: '?lxListItemSecondary',
        },
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListItem', lxListItemDirective);

/////////////////////////////

export { lxListItemDirective };
