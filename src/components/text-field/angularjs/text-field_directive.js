import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiAlertCircle, mdiCheckCircle } from 'LumX/icons';

import template from './text-field.html';

/////////////////////////////

function TextFieldController(LumXUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

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
    lumx.icons = {
        mdiAlertCircle,
        mdiCheckCircle,
    };

    /**
     * The input id.
     *
     * @type {string}
     */
    lumx.inputId = LumXUtilsService.generateUUID();

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
        if (angular.isUndefined(_modelController.$viewValue)) {
            return false;
        }

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

    lumx.hasValue = hasValue;
    lumx.setModelController = setModelController;
}

/////////////////////////////

function TextFieldDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        const _MIN_ROWS = 2;

        let input = el.find('input');

        if (input.length === 1) {
            el.addClass(`${CSS_PREFIX}-text-field--has-input`);
        } else {
            input = el.find('textarea');

            input.on('input', (evt) => {
                evt.target.rows = _MIN_ROWS;
                const currentRows = evt.target.scrollHeight / (evt.target.clientHeight / _MIN_ROWS);
                evt.target.rows = currentRows;
            });

            el.addClass(`${CSS_PREFIX}-text-field--has-textarea`);
        }

        const modelController = input.data('$ngModelController');

        ctrl.setModelController(modelController);

        if (input.attr('id')) {
            ctrl.inputId = input.attr('id');
        } else {
            input.attr('id', ctrl.inputId);
        }

        input
            .on('focus', function onFocus() {
                el.addClass(`${CSS_PREFIX}-text-field--is-focus`);
            })
            .on('blur', function onBlur() {
                el.removeClass(`${CSS_PREFIX}-text-field--is-focus`);
            });

        modelController.$$attr.$observe('disabled', (isDisabled) => {
            if (isDisabled) {
                el.addClass(`${CSS_PREFIX}-text-field--is-disabled`);
            } else {
                el.removeClass(`${CSS_PREFIX}-text-field--is-disabled`);
            }
        });

        modelController.$$attr.$observe('placeholder', (placeholder) => {
            if (placeholder.length > 0) {
                el.addClass(`${CSS_PREFIX}-text-field--has-placeholder`);
            } else {
                el.removeClass(`${CSS_PREFIX}-text-field--has-placeholder`);
            }
        });

        scope.$on('$destroy', () => {
            input.off();
        });
    }

    return {
        bindToController: true,
        controller: TextFieldController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lumxCustomColors',
            hasError: '=?lumxHasError',
            helper: '@?lumxHelper',
            icon: '@?lumxIcon',
            isValid: '=?lumxIsValid',
            label: '@?lumxLabel',
            theme: '@?lumxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.text-field`).directive(`${COMPONENT_PREFIX}TextField`, TextFieldDirective);

/////////////////////////////

export { TextFieldDirective };
