(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoCheckboxController() {
        var vm = this;

        vm.checkboxes = {
            model: {
                checked: true,
                unchecked: false
            },
            states: {
                disabled: false
            },
        };
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoCheckboxController', DemoCheckboxController);
})();
