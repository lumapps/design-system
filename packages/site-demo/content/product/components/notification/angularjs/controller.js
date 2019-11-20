function DemoNotificationController(LumXNotificationService) {
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
            LumXNotificationService.info('Lorem Ipsum', 'Undo', () => {
                LumXNotificationService.success('Callback');
            });
        } else if (type === 'success') {
            LumXNotificationService.success('Lorem Ipsum');
        } else if (type === 'warning') {
            LumXNotificationService.warning('Lorem Ipsum');
        } else if (type === 'error') {
            LumXNotificationService.error('Lorem Ipsum');
        }
    }

    /////////////////////////////

    vm.notify = notify;
}

/////////////////////////////

angular.module('design-system').controller('DemoNotificationController', DemoNotificationController);

/////////////////////////////

export { DemoNotificationController };
