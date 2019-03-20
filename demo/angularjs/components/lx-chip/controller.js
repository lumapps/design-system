import { mdiCheck, mdiClose, mdiCloseCircle, mdiEmail, mdiFilterVariant, mdiMenuDown } from 'LumX/icons';

/////////////////////////////

function DemoChipController(NglxNotificationService) {
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
        mdiCheck,
        mdiClose,
        mdiCloseCircle,
        mdiEmail,
        mdiFilterVariant,
        mdiMenuDown,
    };

    /**
     * Indicates if the chip is active or not.
     *
     * @type {boolean}
     */
    vm.isSelected = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * When the chip has been clicked, display a notification.
     */
    function clickCallback() {
        NglxNotificationService.success('Callback');
    }

    /**
     * Toggle chip selected state.
     */
    function toggleSelected() {
        vm.isSelected = !vm.isSelected;
    }

    /**
     * Select chip.
     */
    function select() {
        if (vm.isSelected) {
            return;
        }

        vm.isSelected = true;
    }

    /**
     * Unselect chip.
     */
    function unselect() {
        if (!vm.isSelected) {
            return;
        }

        vm.isSelected = false;
    }

    /////////////////////////////

    vm.clickCallback = clickCallback;
    vm.toggleSelected = toggleSelected;
    vm.select = select;
    vm.unselect = unselect;
}

/////////////////////////////

angular.module('design-system').controller('DemoChipController', DemoChipController);

/////////////////////////////

export { DemoChipController };
