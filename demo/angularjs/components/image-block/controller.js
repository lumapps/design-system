/////////////////////////////

function DemoImageBlockController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The user fields.
     *
     * @type {Array}
     */
    vm.tags = ['Kawaii', 'Puppey'];
}

/////////////////////////////

angular.module('design-system').controller('DemoImageBlockController', DemoImageBlockController);

/////////////////////////////

export { DemoImageBlockController };
