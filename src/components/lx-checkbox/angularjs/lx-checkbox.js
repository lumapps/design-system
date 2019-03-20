import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiCheck } from 'LumX/icons';

import template from './lx-checkbox.html';

/////////////////////////////

function lxCheckboxController(LxUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxCheckbox = this;

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
     * The checkbox id.
     *
     * @type {string}
     */
    lxCheckbox.checkboxId = LxUtilsService.generateUUID();

    /**
     * Whether the directive has helper slot filled or not.
     *
     * @type {boolean}
     */
    lxCheckbox.hasHelper = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lxCheckbox.hasLabel = false;

    /**
     * Whether the directive has transcluded content if no transclude slot.
     *
     * @type {boolean}
     */
    lxCheckbox.hasTranscluded = false;

    /**
     * The checkbox icons.
     *
     * @type {Object}
     */
    lxCheckbox.icons = {
        mdiCheck,
    };

    /**
     * The model view value.
     *
     * @type {string}
     */
    lxCheckbox.viewValue = undefined;

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
            lxCheckbox.viewValue = _modelController.$viewValue;
        };
    }

    /**
     * Update model controller view value on checkbox click.
     */
    function updateViewValue() {
        if (angular.isUndefined(_modelController)) {
            lxCheckbox.viewValue = !lxCheckbox.viewValue;

            return;
        }

        _modelController.$setViewValue(!_modelController.$viewValue);
        _modelController.$render();
    }

    /////////////////////////////

    lxCheckbox.setModelController = setModelController;
    lxCheckbox.updateViewValue = updateViewValue;
}

/////////////////////////////

function lxCheckboxDirective() {
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
                el.addClass('lx-checkbox--is-disabled');
            } else {
                el.removeClass('lx-checkbox--is-disabled');
            }
        });

        attrs.$observe('checked', (isChecked) => {
            el.find('input').attr('checked', isChecked);

            ctrls[0].viewValue = isChecked;
        });
    }

    return {
        bindToController: true,
        controller: lxCheckboxController,
        controllerAs: 'lxCheckbox',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}Checkbox`, '?ngModel'],
        restrict: 'E',
        scope: {
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            helper: `?${COMPONENT_PREFIX}CheckboxHelper`,
            label: `?${COMPONENT_PREFIX}CheckboxLabel`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.checkbox`).directive(`${COMPONENT_PREFIX}Checkbox`, lxCheckboxDirective);

/////////////////////////////

export { lxCheckboxDirective };
