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
    vm.tags = ['Tag 1', 'Tag 2'];
}

/////////////////////////////

angular.module('design-system').controller('DemoImageBlockController', DemoImageBlockController);

/////////////////////////////

export { DemoImageBlockController };
