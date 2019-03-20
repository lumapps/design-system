import { mdiChevronLeft, mdiDotsVertical, mdiMagnify } from 'LumX/icons';

/////////////////////////////

function DemoToolbarController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiChevronLeft,
        mdiDotsVertical,
        mdiMagnify,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoToolbarController', DemoToolbarController);

/////////////////////////////

export { DemoToolbarController };
