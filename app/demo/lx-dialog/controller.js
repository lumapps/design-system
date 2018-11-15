(function IIFE() {
    'use strict';

    /////////////////////////////

    DemoDialogController.$inject = ['$scope', 'LxDialogService'];

    function DemoDialogController($scope, LxDialogService) {
        var vm = this;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        vm.dialogId = 'dialog-test';

        vm.people = [
        {
            name: 'Adam',
            email: 'adam@email.com',
            age: 10,
        },
        {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
        },
        {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
        },
        {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 31,
        },
        {
            name: 'Estefanía',
            email: 'estefanía@email.com',
            age: 16,
        },
        {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
        },
        {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
        },
        {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
        }];

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        function addPerson() {
            vm.people.push({
                name: 'Lorem',
                email: 'lorem@email.com',
                age: 99,
            });
        }

        function openDialog() {
            LxDialogService.open(vm.dialogId, {
                customMessage: 'Hello World!',
            });
        }

        /////////////////////////////

        vm.addPerson = addPerson;
        vm.openDialog = openDialog;

        /////////////////////////////
        //                         //
        //          Events         //
        //                         //
        /////////////////////////////

        $scope.$on('lx-dialog__open-start', function(event, dialogId, params) {
            if (vm.dialogId === dialogId) {
                console.log('Open start ' + params.customMessage);
            }
        });

        $scope.$on('lx-dialog__open-end', function(event, dialogId) {
            if (vm.dialogId === dialogId) {
                console.log('Open end');
            }
        });

        $scope.$on('lx-dialog__close-start', function(event, dialogId) {
            if (vm.dialogId === dialogId) {
                console.log('Close start');
            }
        });

        $scope.$on('lx-dialog__close-end', function(event, dialogId) {
            if (vm.dialogId === dialogId) {
                console.log('Close end');
            }
        });

        $scope.$on('lx-dialog__scroll-end', function(event, dialogId) {
            if (vm.dialogId === dialogId) {
                console.log('Scroll end');
            }
        });
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoDialogController', DemoDialogController);
})();
