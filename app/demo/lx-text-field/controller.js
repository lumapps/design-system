(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoTextFieldController() {
        var vm = this;

        vm.textFields = {
            model: {
                name: 'Matthias Manoukian',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoTextFieldController', DemoTextFieldController);
})();
