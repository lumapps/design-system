import { mdiSend } from '@lumx/icons';

/////////////////////////////

function DemoListController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiSend,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoListController', DemoListController);

/////////////////////////////

export { DemoListController };
