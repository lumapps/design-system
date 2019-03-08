import { mdiCheck, mdiClose, mdiCloseCircle, mdiEmail, mdiFilterVariant, mdiMenuDown } from 'LumX/icons';

/////////////////////////////

function DemoChipController(LxNotificationService) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiCheck,
        mdiClose,
        mdiCloseCircle,
        mdiEmail,
        mdiFilterVariant,
        mdiMenuDown,
    };
    vm.isSelected = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Clickable chip callback.
     */
    function clickCallback() {
        LxNotificationService.success('Callback');
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
