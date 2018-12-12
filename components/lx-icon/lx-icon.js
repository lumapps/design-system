(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxIconDirective() {
        function getTemplate(el, attrs) {
            var iconClass = 'lx-icon';

            if (angular.isDefined(attrs.lxColor)) {
                iconClass += ' lx-icon--color-' + attrs.lxColor;
            }

            if (angular.isDefined(attrs.lxSize)) {
                iconClass += ' lx-icon--size-' + attrs.lxSize;
            }

            return '<i class="' + iconClass + '"><iconify-icon class="iconify" data-icon="mdi:' + attrs.lxId + '"></iconify-icon></i>';
        }

        return {
            replace: true,
            restrict: 'E',
            template: getTemplate,
        };
    }

    /////////////////////////////

    angular.module('lumx.icon').directive('lxIcon', lxIconDirective);
})();
