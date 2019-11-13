import { mdiDelete, mdiEye, mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoAvatarController() {
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
        mdiDelete,
        mdiEye,
        mdiPencil,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoAvatarController', DemoAvatarController);

/////////////////////////////

export { DemoAvatarController };
