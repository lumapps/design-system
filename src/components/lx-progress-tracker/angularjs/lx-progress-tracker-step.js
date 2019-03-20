import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiAlertCircle, mdiCheckCircle, mdiRadioboxBlank, mdiRadioboxMarked } from 'LumX/icons';

import template from './lx-progress-tracker-step.html';

/////////////////////////////

function ProgressTrackerStepController($scope, $element) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxProgressTrackerStep = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The parentController.
     *
     * @type {Object}
     */
    let _parentController;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get step icon according to its state.
     *
     * @return {string} The icon path.
     */
    function getIcon() {
        if (lxProgressTrackerStep.isComplete) {
            return mdiCheckCircle;
        }

        if (lxProgressTrackerStep.isActive) {
            if (lxProgressTrackerStep.hasError) {
                return mdiAlertCircle;
            }

            return mdiRadioboxMarked;
        }

        return mdiRadioboxBlank;
    }

    /**
     * Wheter the step is clickable or not.
     *
     * @return {boolean} Wheter the step is clickable or not.
     */
    function isClickable() {
        return (
            lxProgressTrackerStep.isActive ||
            lxProgressTrackerStep.isComplete ||
            $element.prev().hasClass('lx-progress-tracker-step--is-complete')
        );
    }

    /**
     * Set parent controller.
     *
     * @param {Object} parentController The parent controller.
     */
    function setParentController(parentController) {
        _parentController = parentController;
    }

    /////////////////////////////

    lxProgressTrackerStep.getIcon = getIcon;
    lxProgressTrackerStep.isClickable = isClickable;
    lxProgressTrackerStep.setParentController = setParentController;

    /////////////////////////////
    //                         //
    //        Watchers         //
    //                         //
    /////////////////////////////

    /**
     * Watch for any changes of the step active step to update the progress bar.
     *
     * @param {boolean} isActive Whether the step is active or not.
     */
    $scope.$watch('lxProgressTrackerStep.isActive', function isActiveWatcher(isActive, wasActive) {
        if (isActive !== wasActive) {
            if (isActive) {
                _parentController.setActiveStep($element.index());
            }
        }
    });
}

/////////////////////////////

function ProgressTrackerStepDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls) {
        ctrls[1].increaseStepCount();
        ctrls[0].setParentController(ctrls[1]);
    }

    return {
        bindToController: true,
        controller: ProgressTrackerStepController,
        controllerAs: 'lxProgressTrackerStep',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}ProgressTrackerStep`, `^${COMPONENT_PREFIX}ProgressTracker`],
        restrict: 'E',
        scope: {
            hasError: '=?lxHasError',
            helper: '@?lxHelper',
            isActive: '=?lxIsActive',
            isComplete: '=?lxIsComplete',
            label: '@lxLabel',
        },
        template,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.progress-tracker`)
    .directive(`${COMPONENT_PREFIX}ProgressTrackerStep`, ProgressTrackerStepDirective);

/////////////////////////////

export { ProgressTrackerStepDirective };
