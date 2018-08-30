(function IIFE() {
    'use strict';

    /////////////////////////////

    lxButtonDirective.$inject = ['LxRipple'];

    function lxButtonDirective(LxRipple) {
        function getTemplate(el, attrs) {
            var buttonType = angular.isDefined(attrs.lxType) ?  attrs.lxType : 'text';
            var buttonTheme = angular.isDefined(attrs.lxTheme) ? attrs.lxTheme : 'primary';
            var buttonClass = 'has-lx-ripple lx-button lx-button--' + buttonType + ' lx-button--' + buttonTheme;

            if (isAnchor(attrs)) {
                return '<a class="' + buttonClass + '" ng-transclude></a>';
            } else {
                return '<button class="' + buttonClass + '" ng-transclude></button>';
            }
        }

        function isAnchor(attrs) {
            return angular.isDefined(attrs.href) ||
                angular.isDefined(attrs.ngHref) ||
                angular.isDefined(attrs.ngLink) ||
                angular.isDefined(attrs.uiSref);
        }

        function link(scope, el, attrs) {
            if (angular.isDefined(attrs.lxIcon)) {
                var icon = angular.element('<i/>', {
                    class: 'lx-button__icon mdi mdi-' + attrs.lxIcon
                });

                el.prepend(icon);
            }

            el.on('click', function onButtonClick(evt) {
                LxRipple.launch(el, 'mouse', evt);
            });
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
