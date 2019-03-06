import { mdiClose, mdiCloseCircle, mdiEmail, mdiFilterVariant, mdiMenuDown } from 'LumX/icons';

/////////////////////////////

function DemoChipController(LxNotificationService) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiClose,
        mdiCloseCircle,
        mdiEmail,
        mdiFilterVariant,
        mdiMenuDown,
    };
    vm.isActive = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    function activate() {
        if (vm.isActive) {
            return;
        }

        vm.isActive = true;
    }

    function clickCallback() {
        LxNotificationService.success('Callback');
    }

    function deactivate() {
        if (!vm.isActive) {
            return;
        }

        vm.isActive = false;
    }

    function toggleCallback() {
        vm.isActive = !vm.isActive;
    }

    /////////////////////////////

    vm.activate = activate;
    vm.clickCallback = clickCallback;
    vm.deactivate = deactivate;
    vm.toggleCallback = toggleCallback;
}

/////////////////////////////

angular.module('design-system').controller('DemoChipController', DemoChipController);

/////////////////////////////

export { DemoChipController };
