import { mdiChevronLeft, mdiDotsVertical, mdiMagnify, mdiMenuDown, mdiTranslate, mdiViewGrid } from 'LumX/icons';

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
        mdiMenuDown,
        mdiTranslate,
        mdiViewGrid,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoToolbarController', DemoToolbarController);

/////////////////////////////

export { DemoToolbarController };
