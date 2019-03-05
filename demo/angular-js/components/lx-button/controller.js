import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

/////////////////////////////

function DemoButtonController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

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
