(function IIFE() {
    'use strict';

    /////////////////////////////

    DemoNotificationController.$inject = ['LxNotificationService'];

    function DemoNotificationController(LxNotificationService) {
        var vm = this;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        function notify(type) {
            if (type === 'info') {
                LxNotificationService.info('Lorem Ipsum', 'Undo', function() {
                    LxNotificationService.success('Callback');
                });
            } else if (type === 'success') {
                LxNotificationService.success('Lorem Ipsum');
            } else if (type === 'warning') {
                LxNotificationService.warning('Lorem Ipsum');
            } else if (type === 'error') {
                LxNotificationService.error('Lorem Ipsum');
            }
        }

        /////////////////////////////

        vm.notify = notify;
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoNotificationController', DemoNotificationController);
})();
