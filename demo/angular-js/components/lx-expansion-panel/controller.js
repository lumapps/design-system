// eslint-disable-next-line import/no-unresolved
import { mdiSend } from '@lumx/icons';

/////////////////////////////

function DemoExpansionPanelController() {
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

angular.module('design-system').controller('DemoExpansionPanelController', DemoExpansionPanelController);

/////////////////////////////

export { DemoExpansionPanelController };
