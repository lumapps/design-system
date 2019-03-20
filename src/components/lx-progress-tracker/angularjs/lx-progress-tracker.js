import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-progress-tracker.html';

/////////////////////////////

function lxProgressTrackerController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxProgressTracker = this;

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
    lxProgressTracker.activeStep = 0;

    /**
     * The number of steps.
     *
     * @type {number}
     */
    lxProgressTracker.stepCount = 0;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Increase step count on step init.
     */
    function increaseStepCount() {
        lxProgressTracker.stepCount++;
    }

    /**
     * Set active step index.
     *
     * @param {number} stepIndex The step index.
     */
    function setActiveStep(stepIndex) {
        lxProgressTracker.activeStep = stepIndex;
    }

    /////////////////////////////

    lxProgressTracker.increaseStepCount = increaseStepCount;
    lxProgressTracker.setActiveStep = setActiveStep;
}

/////////////////////////////

function lxProgressTrackerDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: lxProgressTrackerController,
        controllerAs: 'lxProgressTracker',
        replace: true,
        restrict: 'E',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.progress-tracker`)
    .directive(`${COMPONENT_PREFIX}ProgressTracker`, lxProgressTrackerDirective);

/////////////////////////////

export { lxProgressTrackerDirective };
