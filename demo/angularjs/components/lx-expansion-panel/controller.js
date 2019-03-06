import { mdiSend } from 'LumX/icons';

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
