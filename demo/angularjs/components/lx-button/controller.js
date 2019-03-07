import { mdiMenuDown, mdiPencil, mdiPlus } from 'LumX/icons';

/////////////////////////////

function DemoButtonController() {
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
        mdiMenuDown,
        mdiPencil,
        mdiPlus,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoButtonController', DemoButtonController);

/////////////////////////////

export { DemoButtonController };
