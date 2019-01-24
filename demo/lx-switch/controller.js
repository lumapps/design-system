(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoSwitchController() {
        var vm = this;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        vm.switches = {
            model: {
                checked: true,
                unchecked: false
            },
            states: {
                disabled: true
            },
        };
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoSwitchController', DemoSwitchController);
})();
