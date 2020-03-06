import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';

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
        mdiDelete,
        mdiEye,
        mdiPencil,
    };
}

angular.module('design-system').controller('DemoController', DemoController);
