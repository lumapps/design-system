import template from './lx-list-row.html';

/////////////////////////////

function lxListRowController() {
    // eslint-disable-next-line consistent-this
    const lxListRow = this;

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
    lxListRow.hasContent = false;

    /**
     * Wether the directive has primary slot filled or not.
     *
     * @type {boolean}
     */
    lxListRow.hasPrimary = false;

    /**
     * Wether the directive has secondary slot filled or not.
     *
     * @type {boolean}
     */
    lxListRow.hasSecondary = false;
}

/////////////////////////////

function lxListRowDirective() {
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
        controller: lxListRowController,
        controllerAs: 'lxListRow',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lxIcon',
            isClickable: '=?lxIsClickable',
        },
        template,
        transclude: {
            content: '?lxListRowContent',
            primary: '?lxListRowPrimary',
            secondary: '?lxListRowSecondary',
        },
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListRow', lxListRowDirective);

/////////////////////////////

export { lxListRowDirective };
