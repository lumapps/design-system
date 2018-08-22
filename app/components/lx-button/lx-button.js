(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxButtonDirective() {
        function getTemplate(el, attrs) {
            var buttonType = (typeof attrs.lxType === 'undefined') ? 'text' : attrs.lxType;
            var buttonTheme = (typeof attrs.lxTheme === 'undefined') ? 'primary' : attrs.lxTheme;

            if (isAnchor(attrs)) {
                return '<a class="lx-button lx-button--' + buttonType + ' lx-button--'+ buttonTheme + '" lx-ripple ng-transclude></a>';
            } else {
                return '<button class="lx-button lx-button--' + buttonType + ' lx-button--'+ buttonTheme + '" lx-ripple ng-transclude></button>';
            }
        }

        function isAnchor(attrs) {
            return angular.isDefined(attrs.href) || angular.isDefined(attrs.ngHref) || angular.isDefined(attrs.ngLink) || angular.isDefined(attrs.uiSref);
        }

        function link(scope, el, attrs) {
            if (typeof attrs.lxIcon !== 'undefined') {
                var icon = angular.element('<i/>', {
                    class: 'lx-button__icon mdi mdi-' + attrs.lxIcon
                });

                el.prepend(icon);
            }
        }

        return {
            link: link,
            replace: true,
            restrict: 'E',
            template: getTemplate,
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.button').directive('lxButton', lxButtonDirective);
})();
