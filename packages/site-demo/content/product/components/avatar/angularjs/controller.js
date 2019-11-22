import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';

/////////////////////////////

function DemoController() {
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
        mdiDelete,
        mdiEye,
        mdiPencil,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoController', DemoController);

/////////////////////////////

export { DemoController };
