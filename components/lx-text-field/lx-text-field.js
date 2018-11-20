(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxTextFieldController() {}

    /////////////////////////////

    function lxTextFieldDirective() {
        function link(scope, el) {
            var input = el.find('input');
            var modelController = input.data('$ngModelController');

            input.on('focus', function onFocus() {
                el.addClass('lx-text-field--is-focus');
            }).on('blur', function onBlur() {
                el.removeClass('lx-text-field--is-focus');
            });

            modelController.$$attr.$observe('disabled', function(isDisabled) {
                if (isDisabled) {
                    el.addClass('lx-text-field--is-disabled');
                } else {
                    el.removeClass('lx-text-field--is-disabled');
                }
            });

            scope.$on('$destroy', function onDestroy() {
                input.off();
            });
        }

        return {
            bindToController: true,
            controller: lxTextFieldController,
            controllerAs: 'lxTextField',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                label: '@?lxLabel',
                suffix: '@?lxSuffix',
                theme: '@?lxTheme',
            },
            templateUrl: 'components/lx-text-field/lx-text-field.html',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.text-field').directive('lxTextField', lxTextFieldDirective);
})();
