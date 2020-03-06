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

    /**
     * The list of tags.
     *
     * @type {Array}
     */
    vm.tags = ['Tag 1', 'Tag 2'];
}

angular.module('design-system').controller('DemoController', DemoController);
