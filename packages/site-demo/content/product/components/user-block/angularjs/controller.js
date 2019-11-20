import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';

/////////////////////////////

function DemoUserBlockController(LumXNotificationService) {
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

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Callback on user block click.
     */
    function onClick() {
        LumXNotificationService.success('Click callback');
    }

    /**
     * Callback on user block mouse enter.
     */
    function onMouseEnter() {
        LumXNotificationService.success('Mouse enter callback');
    }

    /**
     * Callback on user block mouse leave.
     */
    function onMouseLeave() {
        LumXNotificationService.success('Mouse leave callback');
    }

    /////////////////////////////

    vm.onClick = onClick;
    vm.onMouseEnter = onMouseEnter;
    vm.onMouseLeave = onMouseLeave;
}

/////////////////////////////

angular.module('design-system').controller('DemoUserBlockController', DemoUserBlockController);

/////////////////////////////

export { DemoUserBlockController };
