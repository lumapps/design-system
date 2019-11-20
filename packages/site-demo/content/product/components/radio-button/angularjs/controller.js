function DemoController() {
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
        test1: 'lorem',
        test2: 'lorem',
    };
}

/////////////////////////////

export { DemoController };
