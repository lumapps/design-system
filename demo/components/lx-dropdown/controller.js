(function IIFE() {
    'use strict';

    /////////////////////////////

    DemoDropdownController.$inject = ['LxDropdownService'];

    function DemoDropdownController(LxDropdownService) {
        var vm = this;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        vm.dropdownId = 'test-dropdown-menu';
        vm.dropdownTarget = 'test-dropdown-target';

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

            LxDropdownService.open(vm.dropdownId, '#' + vm.dropdownTarget);
        }

        /////////////////////////////

        vm.closeDropdown = closeDropdown;
        vm.openDropdown = openDropdown;
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoDropdownController', DemoDropdownController);
})();
