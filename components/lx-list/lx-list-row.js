(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxListRowController() {
        var lxListRow = this;

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
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                icon: '@?lxIcon',
                isActive: '=?lxIsActive',
                isClickable: '=?lxIsClickable',
            },
            templateUrl: 'components/lx-list/lx-list-row.html',
            transclude: {
                content: '?lxListRowContent',
                primary: '?lxListRowPrimary',
                secondary: '?lxListRowSecondary',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.list').directive('lxListRow', lxListRowDirective);
})();
