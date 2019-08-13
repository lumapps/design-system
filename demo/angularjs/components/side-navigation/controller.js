import { mdiArrowTopRightThick, mdiEmail } from 'LumX/icons';

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
        mdiArrowTopRightThick,
        mdiEmail,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoSideNavigationController', DemoSideNavigationController);

/////////////////////////////

export { DemoSideNavigationController };
