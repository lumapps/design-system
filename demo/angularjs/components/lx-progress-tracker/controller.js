function DemoProgressTrackerController(LxNotificationService) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.activeStepIndex = 0;
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

    function isComplete() {
        let countComplete = 0;

        angular.forEach(vm.stepper, function(step) {
            if (step.isComplete) {
                countComplete++;
            }
        });

        if (countComplete === vm.stepper.length) {
            return true;
        }

        return false;
    }

    function next() {
        vm.setCompleteStep(vm.activeStepIndex);
        vm.setActiveStep(vm.activeStepIndex + 1);
    }

    function setActiveStep(index) {
        if (
            angular.isUndefined(vm.stepper[index]) ||
            (angular.isDefined(vm.stepper[index - 1]) && !vm.stepper[index - 1].isComplete)
        ) {
            return;
        }

        angular.forEach(vm.stepper, function(step) {
            step.isActive = false;
        });

        vm.stepper[index].isActive = true;
        vm.activeStepIndex = index;
    }

    function setCompleteStep(index) {
        if (angular.isUndefined(vm.stepper[index])) {
            return;
        }

        vm.stepper[index].isComplete = true;

        if (vm.activeStepIndex === vm.stepper.length - 1 && vm.isComplete()) {
            LxNotificationService.success('Complete');
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
