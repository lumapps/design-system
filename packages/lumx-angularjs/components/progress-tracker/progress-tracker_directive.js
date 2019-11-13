import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './progress-tracker.html';

/////////////////////////////

function ProgressTrackerController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The lactive step index.
     *
     * @type {number}
     */
    lumx.activeStep = 0;

    /**
     * The number of steps.
     *
     * @type {number}
     */
    lumx.stepCount = 0;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Increase step count on step init.
     */
    function increaseStepCount() {
        lumx.stepCount++;
    }

    /**
     * Set active step index.
     *
     * @param {number} stepIndex The step index.
     */
    function setActiveStep(stepIndex) {
        lumx.activeStep = stepIndex;
    }

    /////////////////////////////

    lumx.increaseStepCount = increaseStepCount;
    lumx.setActiveStep = setActiveStep;
}

/////////////////////////////

function ProgressTrackerDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ProgressTrackerController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.progress-tracker`)
    .directive(`${COMPONENT_PREFIX}ProgressTracker`, ProgressTrackerDirective);

/////////////////////////////

export { ProgressTrackerDirective };
