import { mdiFileDocumentBoxOutline, mdiMenu } from 'LumX/icons';

/////////////////////////////

function DemoSideNavigationController() {
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
        mdiFileDocumentBoxOutline,
        mdiMenu,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoSideNavigationController', DemoSideNavigationController);

/////////////////////////////

export { DemoSideNavigationController };
