import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

/////////////////////////////

function DemoUserBlockController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The user fields.
     *
     * @type {Array}
     */
    vm.fields = ['Head of Design', 'Lyon'];

    /**
     * The user block icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiCellphone,
        mdiEmail,
        mdiGoogleHangouts,
        mdiPhone,
        mdiSlack,
    };
}

/////////////////////////////

angular.module('design-system').controller('DemoUserBlockController', DemoUserBlockController);

/////////////////////////////

export { DemoUserBlockController };
