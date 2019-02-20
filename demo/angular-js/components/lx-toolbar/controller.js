// eslint-disable-next-line import/no-unresolved
import { mdiChevronLeft, mdiDotsVertical, mdiMagnify } from '@lumx/icons';

/////////////////////////////

function DemoToolbarController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

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
