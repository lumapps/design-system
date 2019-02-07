(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoTextFieldController() {
        var vm = this;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        vm.textFields = {
            model: {
                name: 'Matthias Manoukian',
            },
        };
    }

    /////////////////////////////

    angular.module('design-system').controller('DemoTextFieldController', DemoTextFieldController);
})();
