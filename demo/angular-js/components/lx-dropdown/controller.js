// eslint-disable-next-line import/no-unresolved
import { mdiEmail, mdiSend } from '@lumx/icons';

/////////////////////////////

function DemoDropdownController(LxDropdownService) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.dropdownId = 'test-dropdown-menu';
    vm.dropdownTarget = 'test-dropdown-target';
    vm.icons = {
        mdiEmail,
        mdiSend,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    function closeDropdown(evt) {
        evt.stopPropagation();

        LxDropdownService.close(vm.dropdownId);
    }

    function openDropdown(evt) {
        evt.stopPropagation();

        LxDropdownService.open(vm.dropdownId, `#${vm.dropdownTarget}`, evt.target);
    }

    /////////////////////////////

    vm.closeDropdown = closeDropdown;
    vm.openDropdown = openDropdown;
}

/////////////////////////////

angular.module('design-system').controller('DemoDropdownController', DemoDropdownController);

/////////////////////////////

export { DemoDropdownController };
