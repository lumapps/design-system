import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from 'LumX/icons';

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
     * Whether the directive has chips slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasChips = false;

    /**
     * Whether the directive has input slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasInput = false;

    /**
     * The text field icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiAlertCircle,
        mdiCheckCircle,
        mdiCloseCircle,
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
     * Clear the model on clear button click.
     *
     * @param {Event} [evt] The event that triggered the function.
     */
    function clearModel(evt) {
        if (angular.isDefined(evt)) {
            evt.stopPropagation();
        }

        _modelController.$setViewValue(undefined);
        _modelController.$render();
    }

    /**
     * Define if the model controller has a value or not.
     *
     * @return {boolean} Wether the model controller has a value or not.
     */
    function hasValue() {
        if (angular.isUndefined(_modelController) || angular.isUndefined(_modelController.$viewValue)) {
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

    lumx.clearModel = clearModel;
    lumx.hasValue = hasValue;
    lumx.setModelController = setModelController;
}

/////////////////////////////

function TextFieldDirective($timeout) {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('chips')) {
            ctrl.hasChips = true;
        }

        if (transclude.isSlotFilled('input')) {
            ctrl.hasInput = true;
        }

        $timeout(() => {
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
            isClearable: '=?lumxIsClearable',
            isValid: '=?lumxIsValid',
            label: '@?lumxLabel',
            theme: '@?lumxTheme',
        },
        template,
        transclude: {
            chips: `?${COMPONENT_PREFIX}TextFieldChips`,
            input: `?${COMPONENT_PREFIX}TextFieldInput`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.text-field`).directive(`${COMPONENT_PREFIX}TextField`, TextFieldDirective);

/////////////////////////////

export { TextFieldDirective };
