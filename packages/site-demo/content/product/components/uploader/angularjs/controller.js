import { mdiTextBoxPlus, mdiImagePlus } from '@lumx/icons';

function DemoController() {
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
        mdiTextBoxPlus,
        mdiImagePlus,
    };
}

angular.module('design-system').controller('DemoController', DemoController);

export { DemoController };
