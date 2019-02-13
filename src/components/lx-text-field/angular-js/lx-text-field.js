import '../style/lx-text-field.scss';

/////////////////////////////

function lxTextFieldController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lxTextField = this;
}

/////////////////////////////

function lxTextFieldDirective() {
    function link(scope, el) {
        const input = el.find('input');
        const modelController = input.data('$ngModelController');

        input
            .on('focus', function onFocus() {
                el.addClass('lx-text-field--is-focus');
            })
            .on('blur', function onBlur() {
                el.removeClass('lx-text-field--is-focus');
            });

        modelController.$$attr.$observe('disabled', (isDisabled) => {
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
        link,
        replace: true,
        restrict: 'E',
        scope: {
            hasError: '=?lxError',
            helper: '@?lxHelper',
            icon: '@?lxIcon',
            isValid: '=?lxValid',
            label: '@?lxLabel',
            theme: '@?lxTheme',
        },
        template: require('./lx-text-field.html'),
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.text-field').directive('lxTextField', lxTextFieldDirective);

/////////////////////////////

export { lxTextFieldDirective };
