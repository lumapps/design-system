(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxChipController() {
        var lxChip = this;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * Wether the directive has label slot filled or not.
         *
         * @type {boolean}
         */
        lxChip.hasLabel = false;

        /**
         * Wether the directive has primary slot filled or not.
         *
         * @type {boolean}
         */
        lxChip.hasPrimary = false;
    }

    /////////////////////////////

    function lxChipDirective() {
        function link(scope, el, attrs, ctrl, transclude) {
            if (transclude.isSlotFilled('primary')) {
                 ctrl.hasPrimary = true;
            }

            if (transclude.isSlotFilled('label')) {
                 ctrl.hasLabel = true;
            }
        }

        return {
            bindToController: true,
            controller: lxChipController,
            controllerAs: 'lxChip',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                isDeletable: '=?lxIsDeletable',
            },
            templateUrl: 'components/lx-chip/lx-chip.html',
            transclude: {
                label: '?lxChipLabel',
                primary: '?lxChipPrimary',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.chip').directive('lxChip', lxChipDirective);
})();
