(function IIFE() {
    'use strict';

    /////////////////////////////

    lxIconButtonDirective.$inject = ['LxRipple'];

    function lxIconButtonDirective(LxRipple) {
        function getTemplate(el, attrs) {
            var buttonTheme = angular.isDefined(attrs.lxTheme) ? attrs.lxTheme : 'dark';
            var buttonClass = 'has-lx-ripple lx-icon-button lx-icon-button--' + buttonTheme;
            var iconClass = 'lx-icon-button__icon mdi mdi-' + attrs.lxIcon;

            if (isAnchor(attrs)) {
                return '<a class="' + buttonClass + '"><i class="' + iconClass + '"></i></a>';
            } else {
                return '<button class="' + buttonClass + '"><i class="' + iconClass + '"></i></button>';
            }
        }

        function isAnchor(attrs) {
            return angular.isDefined(attrs.href) ||
                angular.isDefined(attrs.ngHref) ||
                angular.isDefined(attrs.ngLink) ||
                angular.isDefined(attrs.uiSref);
        }

        function link(scope, el) {
            el.on('click', function onButtonClick() {
                LxRipple.launch(el, 'center');
            });
        }

        return {
            link: link,
            replace: true,
            restrict: 'E',
            template: getTemplate,
        };
    }

    /////////////////////////////

    angular.module('lumx.icon-button').directive('lxIconButton', lxIconButtonDirective);
})();
