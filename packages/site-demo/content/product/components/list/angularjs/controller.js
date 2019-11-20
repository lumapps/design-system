import { mdiSend, mdiDotsHorizontal } from '@lumx/icons';

/////////////////////////////

function DemoListController() {
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
        mdiSend,
        mdiDotsHorizontal,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoListController', DemoListController);

/////////////////////////////

export { DemoListController };
