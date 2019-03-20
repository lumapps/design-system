import { COMPONENT_PREFIX } from 'LumX/angularjs/constants/common_constants';

function DemoDialogController($scope, NglxDialogService, LxNotificationService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The id of the default dialog.
     *
     * @type {string}
     * @constant
     * @readonly
     */
    vm.dialogId = 'dialog-test';

    /**
     * The list of people to display in the dialog.
     *
     * @type {Array<Object>}
     * @constant
     * @readonly
     */
    vm.people = [
        {
            // eslint-disable-next-line no-magic-numbers
            age: 10,
            email: 'adam@email.com',
            name: 'Adam',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 12,
            email: 'amalie@email.com',
            name: 'Amalie',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 30,
            email: 'wladimir@email.com',
            name: 'Wladimir',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 31,
            email: 'samantha@email.com',
            name: 'Samantha',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 16,
            email: 'estefanía@email.com',
            name: 'Estefanía',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 54,
            email: 'natasha@email.com',
            name: 'Natasha',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            age: 43,
            email: 'nicole@email.com',
            name: 'Nicole',
        },
        {
            // eslint-disable-next-line no-magic-numbers
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

    /**
     * Add a person to the list.
     */
    function addPerson() {
        vm.people.push({
            // eslint-disable-next-line no-magic-numbers
            age: 99,
            email: 'lorem@email.com',
            name: 'Lorem',
        });
    }

    /**
     * Display an alert dialog.
     */
    function alertDialog() {
        NglxDialogService.alert({
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

    /**
     * Display a confirm dialog.
     */
    function confirmDialog() {
        NglxDialogService.confirm({
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

    /**
     * Open the default dialog.
     */
    function openDialog() {
        NglxDialogService.open(vm.dialogId, {
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

    /**
     * When the dialog starts to open, log a message in the console.
     *
     * @param {Event}  evt      The dialog open start event.
     * @param {string} dialogId The id of the dialog that is starting to open.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dialog__open-start`, (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            // eslint-disable-next-line no-console
            console.log('Open start');
        }
    });

    /**
     * When the dialog has opened, log a message in the console.
     *
     * @param {Event}  evt      The dialog open end event.
     * @param {string} dialogId The id of the dialog that has opened.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dialog__open-end`, (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            // eslint-disable-next-line no-console
            console.log('Open end');
        }
    });

    /**
     * When the dialog starts to close, log a message in the console.
     *
     * @param {Event}  evt      The dialog close start event.
     * @param {string} dialogId The id of the dialog that is starting to close.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dialog__close-start`, (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            // eslint-disable-next-line no-console
            console.log('Close start');
        }
    });

    /**
     * When the dialog has closed, log a message in the console.
     *
     * @param {Event}  evt      The dialog close end event.
     * @param {string} dialogId The id of the dialog that has closed.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dialog__close-end`, (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            // eslint-disable-next-line no-console
            console.log('Close end');
        }
    });

    /**
     * When the user scrolls to the end of the dialog, log a message in the console.
     *
     * @param {Event}  evt      The dialog scroll end event.
     * @param {string} dialogId The id of the dialog that has been scrolled to the end.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dialog__scroll-end`, (evt, dialogId) => {
        if (vm.dialogId === dialogId) {
            // eslint-disable-next-line no-console
            console.log('Scroll end');
        }
    });
}

/////////////////////////////

angular.module('design-system').controller('DemoDialogController', DemoDialogController);

/////////////////////////////

export { DemoDialogController };
