import { mdiAlertCircle, mdiCheckCircle } from '@lumx/icons';

import '../style/lx-text-field.scss';
import template from './lx-text-field.html';

/////////////////////////////

function lxTextFieldController() {
    // eslint-disable-next-line consistent-this
    const lxTextField = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The text field icons.
     *
     * @type {Object}
     */
    lxTextField.icons = {
        mdiAlertCircle,
        mdiCheckCircle,
    };
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
            hasError: '=?lxHasError',
            helper: '@?lxHelper',
            icon: '@?lxIcon',
            isValid: '=?lxIsValid',
            label: '@?lxLabel',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.text-field').directive('lxTextField', lxTextFieldDirective);

/////////////////////////////

export { lxTextFieldDirective };
