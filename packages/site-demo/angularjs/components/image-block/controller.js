import { mdiDelete, mdiEye, mdiPencil } from 'LumX/icons';

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
