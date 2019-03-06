import { mdiChevronLeft, mdiDotsVertical, mdiMagnify } from 'LumX/icons';

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
