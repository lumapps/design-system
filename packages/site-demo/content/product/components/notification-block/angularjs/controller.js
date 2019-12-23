import { mdiClose, mdiHeart, mdiMessageTextOutline } from '@lumx/icons';

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
     * The user block icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiClose,
        mdiHeart,
        mdiMessageTextOutline,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoController', DemoController);

/////////////////////////////

export { DemoController };
