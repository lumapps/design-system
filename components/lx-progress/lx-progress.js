(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxProgressControler() {
        var lxProgress = this;
    }

    /////////////////////////////

    function lxProgressDirective() {
        return {
            bindToController: true,
            controller: lxProgressControler,
            controllerAs: 'lxProgress',
            replace: true,
            restrict: 'E',
            scope: {
                type: '@?lxType',
            },
            templateUrl: 'components/lx-progress/lx-progress.html',
            transclude: {
                help: '?lxCheckboxHelp',
                label: '?lxCheckboxLabel',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.progress').directive('lxProgress', lxProgressDirective);
})();
