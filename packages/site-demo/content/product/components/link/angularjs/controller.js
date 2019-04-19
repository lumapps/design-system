import { mdiHelpCircle } from 'LumX/icons';

/////////////////////////////

function DemoLinkController() {
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
        mdiHelpCircle,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoLinkController', DemoLinkController);

/////////////////////////////

export { DemoLinkController };
