function DemoCheckboxController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.checkboxes = {
        model: {
            checked: true,
            unchecked: false,
        },
        states: {
            disabled: true,
        },
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoCheckboxController', DemoCheckboxController);

/////////////////////////////

export { DemoCheckboxController };
