import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';

export function DemoController(LxNotificationService) {
    'ngInject';

    const vm = this;

    /**
     * The user fields.
     *
     * @type {Array}
     */
    vm.fields = ['Head of Design', 'Lyon'];

    /**
     * The user block icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiCellphone,
        mdiEmail,
        mdiGoogleHangouts,
        mdiPhone,
        mdiSlack,
    };

    /**
     * Callback on user block click.
     */
    function onClick() {
        LxNotificationService.success('Click callback');
    }

    /**
     * Callback on user block mouse enter.
     */
    function onMouseEnter() {
        LxNotificationService.success('Mouse enter callback');
    }

    /**
     * Callback on user block mouse leave.
     */
    function onMouseLeave() {
        LxNotificationService.success('Mouse leave callback');
    }

    vm.onClick = onClick;
    vm.onMouseEnter = onMouseEnter;
    vm.onMouseLeave = onMouseLeave;
}

angular.module('design-system').controller('DemoController', DemoController);
