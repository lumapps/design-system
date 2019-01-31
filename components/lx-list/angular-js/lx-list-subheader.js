(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxListSubheaderDirective() {
        return {
            replace: true,
            restrict: 'E',
            template: '<li class="lx-list-subheader" ng-transclude></li>',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.list').directive('lxListSubheader', lxListSubheaderDirective);
})();
