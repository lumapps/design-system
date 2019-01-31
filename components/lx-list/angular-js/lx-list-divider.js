(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxListDividerDirective() {
        return {
            replace: true,
            restrict: 'E',
            template: '<li class="lx-list-divider"></li>',
        };
    }

    /////////////////////////////

    angular.module('lumx.list').directive('lxListDivider', lxListDividerDirective);
})();
