(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxIconDirective() {
        function getTemplate(el, attrs) {
            var iconClass = 'material-icons lx-icon';

            if (angular.isDefined(attrs.lxColor)) {
                iconClass += ' lx-icon--color-' + attrs.lxColor;
            }

            if (angular.isDefined(attrs.lxSize)) {
                iconClass += ' lx-icon--size-' + attrs.lxSize;
            }

            return '<i class="' + iconClass + '" ng-transclude></i>';
        }

        return {
            replace: true,
            restrict: 'E',
            template: getTemplate,
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.icon').directive('lxIcon', lxIconDirective);
})();
