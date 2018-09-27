(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoSelectController() {
        var vm = this;

        vm.mode = 'Fill';
        vm.modes = ['Fill', 'Fit', 'Auto'];
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoSelectController', DemoSelectController);
})();
