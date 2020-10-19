import { mdiFileDocumentBoxOutline, mdiMenu } from '@lumx/icons';

function DemoSideNavigationController() {
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
        mdiFileDocumentBoxOutline,
        mdiMenu,
    };
}

export { DemoSideNavigationController };
