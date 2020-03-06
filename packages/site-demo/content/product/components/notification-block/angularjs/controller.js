import { mdiClose, mdiHeart, mdiMessageTextOutline } from '@lumx/icons';

export function DemoController() {
    'ngInject';

    const vm = this;

    /**
     * The user block icons.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiClose,
        mdiHeart,
        mdiMessageTextOutline,
    };
}

angular.module('design-system').controller('DemoController', DemoController);
