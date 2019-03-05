import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-switch.scss';
import template from './lx-switch.html';

/////////////////////////////

function lxSwitchController(LxUtilsService) {
    // eslint-disable-next-line consistent-this
    const lxSwitch = this;

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
     * The switch id.
     *
     * @type {string}
     */
    lxSwitch.switchId = LxUtilsService.generateUUID();

    /**
     * Whether the directive has helper slot filled or not.
     *
     * @type {boolean}
     */
    lxSwitch.hasHelper = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lxSwitch.hasLabel = false;

    /**
     * Whether the directive has transcluded content if no transclude slot.
     *
     * @type {boolean}
     */
    lxSwitch.hasTranscluded = false;

    /**
     * The model view value.
     *
     * @type {string}
     */
    lxSwitch.viewValue = undefined;

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
            lxSwitch.viewValue = _modelController.$viewValue;
        };
    }

    /**
     * Update model controller view value on switch click.
     */
    function updateViewValue() {
        if (angular.isUndefined(_modelController)) {
            lxSwitch.viewValue = !lxSwitch.viewValue;

            return;
        }

        _modelController.$setViewValue(!_modelController.$viewValue);
        _modelController.$render();
    }

    /////////////////////////////

    lxSwitch.setModelController = setModelController;
    lxSwitch.updateViewValue = updateViewValue;
}

/////////////////////////////

function lxSwitchDirective() {
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
                el.addClass('lx-switch--is-disabled');
            } else {
                el.removeClass('lx-switch--is-disabled');
            }
        });

        attrs.$observe('checked', (isChecked) => {
            el.find('input').attr('checked', isChecked);

            ctrls[0].viewValue = isChecked;
        });
    }

    return {
        bindToController: true,
        controller: lxSwitchController,
        controllerAs: 'lxSwitch',
        link,
        replace: true,
        require: ['lxSwitch', '?ngModel'],
        restrict: 'E',
        scope: {
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            helper: '?lxSwitchHelper',
            label: '?lxSwitchLabel',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.switch`).directive('lxSwitch', lxSwitchDirective);

/////////////////////////////

export { lxSwitchDirective };
