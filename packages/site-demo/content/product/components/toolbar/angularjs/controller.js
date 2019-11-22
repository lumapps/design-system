import { mdiChevronLeft, mdiDotsVertical, mdiMagnify, mdiMenuDown, mdiTranslate, mdiViewGrid } from '@lumx/icons';

/////////////////////////////

function DemoController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     */
    vm.icons = {
        mdiChevronLeft,
        mdiDotsVertical,
        mdiMagnify,
        mdiMenuDown,
        mdiTranslate,
        mdiViewGrid,
    };

    /**
     * The search field model.
     *
     * @type {string}
     */
    vm.searchFieldModel = '';
}

/////////////////////////////

angular.module('design-system').controller('DemoController', DemoController);

/////////////////////////////

export { DemoController };
