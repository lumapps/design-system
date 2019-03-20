function DemoNotificationController(NglxNotificationService) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Display a notification.
     *
     * @param {string} type The type of notification to display.
     *                      Possible values are: 'info', 'success', 'warning' or 'error'.
     */
    function notify(type) {
        if (type === 'info') {
            NglxNotificationService.info('Lorem Ipsum', 'Undo', () => {
                NglxNotificationService.success('Callback');
            });
        } else if (type === 'success') {
            NglxNotificationService.success('Lorem Ipsum');
        } else if (type === 'warning') {
            NglxNotificationService.warning('Lorem Ipsum');
        } else if (type === 'error') {
            NglxNotificationService.error('Lorem Ipsum');
        }
    }

    /////////////////////////////

    vm.notify = notify;
}

/////////////////////////////

angular.module('design-system').controller('DemoNotificationController', DemoNotificationController);

/////////////////////////////

export { DemoNotificationController };
