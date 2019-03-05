import { mdiMagnify } from '@lumx/icons';

/////////////////////////////

function DemoTextFieldController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiMagnify,
    };
    vm.textFields = {
        model: {
            name: 'Matthias Manoukian',
        },
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoTextFieldController', DemoTextFieldController);

/////////////////////////////

export { DemoTextFieldController };
