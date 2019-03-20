function DemoProgressTrackerController(NglxNotificationService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The index of the currently active step of the stepper.
     *
     * @type {number}
     */
    vm.activeStepIndex = 0;

    /**
     * The configuration of the stepper.
     *
     * @type {Array<Object>}
     * @constant
     * @readonly
     */
    vm.stepper = [
        {
            content: 'lorem ipsum 1',
            hasError: true,
            helper: 'Lorem ipsum',
            isActive: true,
            isComplete: false,
            label: 'First step',
        },
        {
            content: 'lorem ipsum 2',
            hasError: true,
            helper: 'Lorem ipsum',
            isActive: false,
            isComplete: false,
            label: 'Second step',
        },
        {
            content: 'lorem ipsum 3',
            hasError: false,
            helper: 'Lorem ipsum',
            isActive: false,
            isComplete: false,
            label: 'Third step',
        },
        {
            content: 'lorem ipsum 4',
            hasError: false,
            helper: 'Lorem ipsum',
            isActive: false,
            isComplete: false,
            label: 'Fourth step',
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Check if the stepper is complete, i.e. if all the steps have been completed.
     *
     * @return {boolean} If the stepper is complete.
     */
    function isComplete() {
        let countComplete = 0;

        angular.forEach(vm.stepper, (step) => {
            if (step.isComplete) {
                countComplete++;
            }
        });

        if (countComplete === vm.stepper.length) {
            return true;
        }

        return false;
    }

    /**
     * Go to the next step of the stepper.
     */
    function next() {
        vm.setCompleteStep(vm.activeStepIndex);
        vm.setActiveStep(vm.activeStepIndex + 1);
    }

    /**
     * Directly go to the given step of the stepper.
     *
     * @param {number} index The index of the step to go to.
     */
    function setActiveStep(index) {
        if (
            angular.isUndefined(vm.stepper[index]) ||
            (angular.isDefined(vm.stepper[index - 1]) && !vm.stepper[index - 1].isComplete)
        ) {
            return;
        }

        angular.forEach(vm.stepper, (step) => {
            step.isActive = false;
        });

        vm.stepper[index].isActive = true;
        vm.activeStepIndex = index;
    }

    /**
     * Flag a step as completed.
     *
     * @param {number} index The index of the step to flag as completed.
     */
    function setCompleteStep(index) {
        if (angular.isUndefined(vm.stepper[index])) {
            return;
        }

        vm.stepper[index].isComplete = true;

        if (vm.activeStepIndex === vm.stepper.length - 1 && vm.isComplete()) {
            NglxNotificationService.success('Complete');
        }
    }

    /////////////////////////////

    vm.isComplete = isComplete;
    vm.next = next;
    vm.setActiveStep = setActiveStep;
    vm.setCompleteStep = setCompleteStep;
}

/////////////////////////////

angular.module('design-system').controller('DemoProgressTrackerController', DemoProgressTrackerController);

/////////////////////////////

export { DemoProgressTrackerController };
