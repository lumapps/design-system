function DemoDialogController($scope, LxDialogService, LxNotificationService) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.dialogId = 'dialog-test';

    vm.people = [
        {
            age: 10,
            email: 'adam@email.com',
            name: 'Adam',
        },
        {
            age: 12,
            email: 'amalie@email.com',
            name: 'Amalie',
        },
        {
            age: 30,
            email: 'wladimir@email.com',
            name: 'Wladimir',
        },
        {
            age: 31,
            email: 'samantha@email.com',
            name: 'Samantha',
        },
        {
            age: 16,
            email: 'estefanía@email.com',
            name: 'Estefanía',
        },
        {
            age: 54,
            email: 'natasha@email.com',
            name: 'Natasha',
        },
        {
            age: 43,
            email: 'nicole@email.com',
            name: 'Nicole',
        },
        {
            age: 21,
            email: 'adrian@email.com',
            name: 'Adrian',
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    function addPerson() {
        vm.people.push({
            age: 99,
            email: 'lorem@email.com',
            name: 'Lorem',
        });
    }

    function alertDialog() {
        LxDialogService.alert({
            cb: function onAnswer() {
                LxNotificationService.info('Alert callback');
            },
            buttons: {
                ok: 'Agree',
            },
            source: '#alert-dialog-source',
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
            title: 'Lorem Ipsum',
        });
    }

    function confirmDialog() {
        LxDialogService.confirm({
            cb: function onAnswer(answer) {
                if (answer) {
                    LxNotificationService.success('Agree');
                } else {
                    LxNotificationService.error('Disagree');
                }
            },
            buttons: {
                cancel: 'Disagree',
                ok: 'Agree',
            },
            source: '#confirm-dialog-source',
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.',
            title: 'Lorem Ipsum',
        });
    }

    function openDialog() {
        LxDialogService.open(vm.dialogId, {
            source: '#default-dialog-source',
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

    $scope.$on('lx-dialog__open-start', (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            console.log('Open start');
        }
    });

    $scope.$on('lx-dialog__open-end', (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            console.log('Open end');
        }
    });

    $scope.$on('lx-dialog__close-start', (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            console.log('Close start');
        }
    });

    $scope.$on('lx-dialog__close-end', (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            console.log('Close end');
        }
    });

    $scope.$on('lx-dialog__scroll-end', (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            console.log('Scroll end');
        }
    });
}

/////////////////////////////

angular.module('design-system').controller('DemoDialogController', DemoDialogController);

/////////////////////////////

export { DemoDialogController };
