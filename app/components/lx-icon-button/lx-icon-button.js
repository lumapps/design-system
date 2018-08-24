(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxIconButtonDirective() {
        function getTemplate(el, attrs) {
            var buttonTheme = angular.isDefined(attrs.lxTheme) ? attrs.lxTheme : 'dark';
            var buttonClass = 'lx-icon-button lx-icon-button--' + buttonTheme;
            var iconClass = 'lx-icon-button__icon mdi mdi-' + attrs.lxIcon;

            if (isAnchor(attrs)) {
                return '<a class="' + buttonClass + '" lx-ripple><i class="' + iconClass + '"></i></a>';
            } else {
                return '<button class="' + buttonClass + '" lx-ripple><i class="' + iconClass + '"></i></button>';
            }
        }

        function isAnchor(attrs) {
            return angular.isDefined(attrs.href) ||
                angular.isDefined(attrs.ngHref) ||
                angular.isDefined(attrs.ngLink) ||
                angular.isDefined(attrs.uiSref);
        }

        return {
            replace: true,
            restrict: 'E',
            template: getTemplate,
        };
    }

    /////////////////////////////

    angular.module('lumx.icon-button').directive('lxIconButton', lxIconButtonDirective);
})();
