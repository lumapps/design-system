function DemoRadioButtonController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Contains all the available radio buttons to display on the demo page.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.radioButtons = {
        basic: {
            test1: '',
            test2: '',
        },
        colors: {
            test4: 'lorem',
        },
        states: {
            test3: 'dolor',
        },
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoRadioButtonController', DemoRadioButtonController);

/////////////////////////////

export { DemoRadioButtonController };
