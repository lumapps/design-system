import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

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
        mdiMenuDown,
        mdiPencil,
        mdiPlus,
    };

    /**
     * Wheter the toggle button is selected or not.
     *
     * @type {Object}
     */
    vm.isSelected = false;

    /**
     * Toggle chip selected state.
     */
    function toggleSelected() {
        vm.isSelected = !vm.isSelected;
    }

    vm.toggleSelected = toggleSelected;
}

angular.module('design-system').controller('DemoController', DemoController);

export { DemoController };
