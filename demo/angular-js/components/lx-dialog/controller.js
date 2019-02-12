(function IIFE() {
    'use strict';

    /////////////////////////////

    DemoDialogController.$inject = ['$scope', 'LxDialogService', 'LxNotificationService'];

    function DemoDialogController($scope, LxDialogService, LxNotificationService) {
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
            },
        ];

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

        function alertDialog() {
            LxDialogService.alert(
                'Lorem Ipsum',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
                'Ok',
                function() {
                    LxNotificationService.info('Alert callback');
                },
            );
        }

        function confirmDialog() {
            LxDialogService.confirm(
                'Lorem Ipsum',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
                {
                    cancel: 'Disagree',
                    ok: 'Agree',
                },
                function(answer) {
                    if (answer) {
                        LxNotificationService.success('Agree');
                    } else {
                        LxNotificationService.error('Disagree');
                    }
                },
            );
        }

        function openDialog() {
            LxDialogService.open(vm.dialogId, {
                customMessage: 'Hello World!',
            });
        }

        /////////////////////////////

        vm.addPerson = addPerson;
        vm.alertDialog = alertDialog;
        vm.confirmDialog = confirmDialog;
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

    angular.module('design-system').controller('DemoDialogController', DemoDialogController);
})();
