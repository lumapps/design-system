import { mdiUpload } from 'LumX/icons';

/////////////////////////////

function DemoUploaderController() {
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
        mdiUpload,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoUploaderController', DemoUploaderController);

/////////////////////////////

export { DemoUploaderController };
