import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './switch.html';

/////////////////////////////

function SwitchController(LumXUtilsService) {
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
     * The switch id.
     *
     * @type {string}
     */
    lumx.switchId = LumXUtilsService.generateUUID();

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
     * Update model controller view value on switch click.
     */
    function updateViewValue() {
        if (angular.isUndefined(_modelController)) {
            lumx.viewValue = !lumx.viewValue;

            return;
        }

        _modelController.$setViewValue(!_modelController.$viewValue);
        _modelController.$render();
    }

    /////////////////////////////

    lumx.setModelController = setModelController;
    lumx.updateViewValue = updateViewValue;
}

/////////////////////////////

function SwitchDirective() {
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
                el.addClass(`${CSS_PREFIX}-switch--is-disabled`);
            } else {
                el.removeClass(`${CSS_PREFIX}-switch--is-disabled`);
            }
        });

        attrs.$observe('checked', (isChecked) => {
            el.find('input').attr('checked', isChecked);

            ctrls[0].viewValue = isChecked;
        });
    }

    return {
        bindToController: true,
        controller: SwitchController,
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}Switch`, '?ngModel'],
        restrict: 'E',
        scope: {
            position: '@?lumxPosition',
            theme: '@?lumxTheme',
        },
        template,
        transclude: {
            helper: `?${COMPONENT_PREFIX}SwitchHelper`,
            label: `?${COMPONENT_PREFIX}SwitchLabel`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.switch`).directive(`${COMPONENT_PREFIX}Switch`, SwitchDirective);

/////////////////////////////

export { SwitchDirective };
