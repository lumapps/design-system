import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiAlertCircle, mdiCheckCircle, mdiRadioboxBlank, mdiRadioboxMarked } from 'LumX/icons';

import template from './progress-tracker-step.html';

/////////////////////////////

function ProgressTrackerStepController($scope, $element) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

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
        if (lumx.isComplete) {
            return mdiCheckCircle;
        }

        if (lumx.isActive) {
            if (lumx.hasError) {
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
            lumx.isActive ||
            lumx.isComplete ||
            $element.prev().hasClass(`${COMPONENT_PREFIX}-progress-tracker-step--is-complete`)
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

    lumx.getIcon = getIcon;
    lumx.isClickable = isClickable;
    lumx.setParentController = setParentController;

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
    $scope.$watch('lumx.isActive', function isActiveWatcher(isActive, wasActive) {
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
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}ProgressTrackerStep`, `^${COMPONENT_PREFIX}ProgressTracker`],
        restrict: 'E',
        scope: {
            hasError: '=?lumxHasError',
            helper: '@?lumxHelper',
            isActive: '=?lumxIsActive',
            isComplete: '=?lumxIsComplete',
            label: '@lumxLabel',
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
