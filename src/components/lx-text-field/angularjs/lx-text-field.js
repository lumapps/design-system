import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiAlertCircle, mdiCheckCircle } from 'LumX/icons';

import template from './lx-text-field.html';

/////////////////////////////

function TextFieldController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxTextField = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The model controller.
     *
     * @type {Object}
     */
    let _modelController;

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

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Define if the model controller has a value or not.
     *
     * @return {boolean} Wether the model controller has a value or not.
     */
    function hasValue() {
        return _modelController.$viewValue.length;
    }

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;
    }

    /////////////////////////////

    lxTextField.hasValue = hasValue;
    lxTextField.setModelController = setModelController;
}

/////////////////////////////

function TextFieldDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        const input = el.find('input');
        const modelController = input.data('$ngModelController');

        ctrl.setModelController(modelController);

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

        modelController.$$attr.$observe('placeholder', (placeholder) => {
            if (placeholder.length > 0) {
                el.addClass('lx-text-field--has-placeholder');
            } else {
                el.removeClass('lx-text-field--has-placeholder');
            }
        });

        scope.$on('$destroy', function onDestroy() {
            input.off();
        });
    }

    return {
        bindToController: true,
        controller: TextFieldController,
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

angular.module(`${MODULE_NAME}.text-field`).directive(`${COMPONENT_PREFIX}TextField`, TextFieldDirective);

/////////////////////////////

export { TextFieldDirective };
