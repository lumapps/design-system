import template from './progress-tracker.html';

/////////////////////////////

function ProgressTrackerController() {
    'ngInject';

    const lx = this;

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
    lx.activeStep = 0;

    /**
     * The number of steps.
     *
     * @type {number}
     */
    lx.stepCount = 0;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Increase step count on step init.
     */
    function increaseStepCount() {
        lx.stepCount++;
    }

    /**
     * Set active step index.
     *
     * @param {number} stepIndex The step index.
     */
    function setActiveStep(stepIndex) {
        lx.activeStep = stepIndex;
    }

    /////////////////////////////

    lx.increaseStepCount = increaseStepCount;
    lx.setActiveStep = setActiveStep;
}

/////////////////////////////

function ProgressTrackerDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ProgressTrackerController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.progress-tracker').directive('lxProgressTracker', ProgressTrackerDirective);

/////////////////////////////

export { ProgressTrackerDirective };
