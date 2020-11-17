function DemoController() {
    'ngInject';

    const vm = this;

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

angular.module('design-system').controller('DemoController', DemoController);

export { DemoController };
