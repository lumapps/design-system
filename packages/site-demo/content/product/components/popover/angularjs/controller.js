import { mdiCellphone, mdiClose, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';

/////////////////////////////

function DemoController(LumXPopoverService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The id of the popover.
     *
     * @type {string}
     * @constant
     * @readonly
     */
    vm.popoverId = 'test-popover';
    vm.popoverTarget = 'test-popover-target';
    vm.popoverSource = 'test-popover-source';

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
        mdiClose,
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
     * Close the popover.
     */
    function closePopover() {
        LumXPopoverService.close(vm.popoverId);
    }

    /**
     * Open the popover.
     */
    function openPopover() {
        LumXPopoverService.open(vm.popoverId, {
            target: `#${vm.popoverTarget}`,
            source: `#${vm.popoverSource}`,
        });
    }

    /////////////////////////////

    vm.closePopover = closePopover;
    vm.openPopover = openPopover;
}

/////////////////////////////

export { DemoController };
