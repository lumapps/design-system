import { mdiCellphone, mdiClose, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';

function DemoController(LxPopoverService) {
    'ngInject';

    const vm = this;

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

    /**
     * Close the popover.
     */
    function closePopover() {
        LxPopoverService.close(vm.popoverId);
    }

    /**
     * Open the popover.
     */
    function openPopover() {
        LxPopoverService.open(vm.popoverId, {
            target: `#${vm.popoverTarget}`,
            source: `#${vm.popoverSource}`,
        });
    }

    vm.closePopover = closePopover;
    vm.openPopover = openPopover;
}

angular.module('design-system').controller('DemoController', DemoController);

export { DemoController };
