import { mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoTabsController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The tabs to display in the demo page.
     *
     * @type {Array<Object>}
     */
    vm.tabs = [
        {
            content: 'Tab 1 content',
            heading: 'Tab 1',
            icon: mdiPencil,
        },
        {
            content: 'Tab 2 content',
            heading: 'Tab 2',
            icon: mdiPencil,
        },
        {
            content: 'Tab 3 content',
            heading: 'Tab 3',
            icon: mdiPencil,
        },
    ];
}

/////////////////////////////

angular.module('design-system').controller('DemoTabsController', DemoTabsController);

/////////////////////////////

export { DemoTabsController };
