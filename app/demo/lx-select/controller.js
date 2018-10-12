(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoSelectController() {
        var vm = this;

        vm.selectPeople = [{
            name: 'Adam',
            email: 'adam@email.com',
            age: 10,
        }, {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
        }, {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
        }, {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 31,
        }, {
            name: 'Estefanía',
            email: 'estefanía@email.com',
            age: 16,
        }, {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
        }, {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
        }, {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
        }];

        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
        };
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoSelectController', DemoSelectController);
})();
