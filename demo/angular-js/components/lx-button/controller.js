// eslint-disable-next-line import/no-unresolved
import { mdiPencil, mdiPlus } from '@lumx/icons';

/////////////////////////////

function DemoButtonController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiPencil,
        mdiPlus,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoButtonController', DemoButtonController);

/////////////////////////////

export { DemoButtonController };
