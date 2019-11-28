import { mdiAlertCircle, mdiCheckCircle, mdiRadioboxBlank, mdiRadioboxMarked } from '@lumx/icons';

import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './progress-tracker-step.html';

/////////////////////////////

function ProgressTrackerStepController($scope, $element) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

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
     * Get progress tracker step classes.
     *
     * @return {Array} The list of progress tracker step classes.
     */
    function getClasses() {
        const classes = [];

        if (lx.isActive) {
            classes.push(`${CSS_PREFIX}-progress-tracker-step--is-active`);
        }

        if (lx.isComplete) {
            classes.push(`${CSS_PREFIX}-progress-tracker-step--is-complete`);
        }

        if (lx.isClickable()) {
            classes.push(`${CSS_PREFIX}-progress-tracker-step--is-clickable`);
        }

        if (lx.isActive && lx.hasError) {
            classes.push(`${CSS_PREFIX}-progress-tracker-step--has-error`);
        }

        return classes;
    }

    /**
     * Get step icon according to its state.
     *
     * @return {string} The icon path.
     */
    function getIcon() {
        if (lx.isComplete) {
            return mdiCheckCircle;
        }

        if (lx.isActive) {
            if (lx.hasError) {
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
            lx.isActive || lx.isComplete || $element.prev().hasClass(`${CSS_PREFIX}-progress-tracker-step--is-complete`)
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

    lx.getClasses = getClasses;
    lx.getIcon = getIcon;
    lx.isClickable = isClickable;
    lx.setParentController = setParentController;

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
    $scope.$watch('lx.isActive', function isActiveWatcher(isActive) {
        if (isActive) {
            _parentController.setActiveStep($element.index());
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
        controllerAs: 'lx',
        link,
        replace: true,
        require: ['lxProgressTrackerStep', '^lxProgressTracker'],
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

angular.module('lumx.progress-tracker').directive('lxProgressTrackerStep', ProgressTrackerStepDirective);

/////////////////////////////

export { ProgressTrackerStepDirective };
