// eslint-disable-next-line import/no-unresolved
import { mdiEmail } from '@lumx/icons';

/////////////////////////////

function DemoChipController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiEmail,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoChipController', DemoChipController);

/////////////////////////////

export { DemoChipController };
