import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-radio-button.html';

/////////////////////////////

function RadioButtonController(NglxUtilsService) {
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
     * The radio button id.
     *
     * @type {string}
     */
    lumx.radioButtonId = NglxUtilsService.generateUUID();

    /**
     * Whether the directive has helper slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasHelper = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasLabel = false;

    /**
     * Whether the directive has transcluded content if no transclude slot.
     *
     * @type {boolean}
     */
    lumx.hasTranscluded = false;

    /**
     * The radio button value.
     *
     * @type {string}
     */
    lumx.radioButtonValue = undefined;

    /**
     * The model view value.
     *
     * @type {string}
     */
    lumx.viewValue = undefined;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;

        _modelController.$render = function onModelRender() {
            lumx.viewValue = _modelController.$viewValue;
        };
    }

    /**
     * Update model controller view value on radio button click.
     */
    function updateViewValue() {
        if (angular.isUndefined(_modelController)) {
            return;
        }

        _modelController.$setViewValue(lumx.radioButtonValue);
        _modelController.$render();
    }

    /////////////////////////////

    lumx.setModelController = setModelController;
    lumx.updateViewValue = updateViewValue;
}

/////////////////////////////

function RadioButtonDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        if (ctrls[1]) {
            ctrls[0].setModelController(ctrls[1]);
        }

        if (transclude.isSlotFilled('label')) {
            ctrls[0].hasLabel = true;
        }

        if (transclude.isSlotFilled('helper')) {
            ctrls[0].hasHelper = true;
        }

        if (!ctrls[0].hasLabel && !ctrls[0].hasHelper) {
            transclude((clone) => {
                if (clone.length > 0) {
                    ctrls[0].hasTranscluded = true;
                }
            });
        }

        attrs.$observe('disabled', (isDisabled) => {
            el.find('input').attr('disabled', isDisabled);

            if (isDisabled) {
                el.addClass('lx-radio-button--is-disabled');
            } else {
                el.removeClass('lx-radio-button--is-disabled');
            }
        });

        attrs.$observe('name', (newName) => {
            el.find('input').attr('name', newName);
        });

        attrs.$observe('value', (newValue) => {
            el.find('input').attr('value', newValue);

            ctrls[0].radioButtonValue = newValue;
        });
    }

    return {
        bindToController: true,
        controller: RadioButtonController,
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}RadioButton`, '?ngModel'],
        restrict: 'E',
        scope: {
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            helper: `?${COMPONENT_PREFIX}RadioButtonHelper`,
            label: `?${COMPONENT_PREFIX}RadioButtonLabel`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.radio-button`).directive(`${COMPONENT_PREFIX}RadioButton`, RadioButtonDirective);

/////////////////////////////

export { RadioButtonDirective };
