import '../style/lx-list.scss';

(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxListDirective() {
        return {
            replace: true,
            restrict: 'E',
            template: '<ul class="lx-list" ng-transclude></ul>',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.list').directive('lxList', lxListDirective);
})();
