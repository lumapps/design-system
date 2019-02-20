function DemoSwitchController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.switches = {
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

angular.module('design-system').controller('DemoSwitchController', DemoSwitchController);

/////////////////////////////

export { DemoSwitchController };
