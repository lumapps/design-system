import { mdiSend, mdiDotsHorizontal } from '@lumx/icons';

export function DemoController() {
    'ngInject';

    const vm = this;

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiSend,
        mdiDotsHorizontal,
    };
}

angular.module('design-system').controller('DemoController', DemoController);
