import { mdiSend } from '@lumx/icons';

/////////////////////////////

function DemoExpansionPanelController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiSend,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoExpansionPanelController', DemoExpansionPanelController);

/////////////////////////////

export { DemoExpansionPanelController };
