function DemoController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The various type of checkboxes states and status.
     *
     * @type {Object}
     */
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

angular.module('design-system').controller('DemoController', [DemoController]);

/////////////////////////////

export { DemoController };
