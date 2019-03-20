import { mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoTabsController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The index of the tab that will be added.
     *
     * @type {number}
     */
    let _tabIndex;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The currently active tab.
     *
     * @type {number}
     */
    vm.activeTab = 1;

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiPencil,
    };

    /**
     * Indicate if a tab is disabled.
     *
     * @type {boolean}
     */
    vm.isTabDisabled = false;

    /**
     * The tabs to display in the demo page.
     *
     * @type {Array<Object>}
     */
    vm.tabs = [
        {
            content: 'Tab 1 content',
            heading: 'Tab 1',
        },
        {
            content: 'Tab 2 content',
            heading: 'Tab 2',
        },
        {
            content: 'Tab 3 content',
            heading: 'Tab 3',
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Add a new tab.
     */
    function addTab() {
        vm.tabs.push({
            content: `Tab ${_tabIndex} content`,
            heading: `Tab ${_tabIndex}`,
        });

        ++_tabIndex;
    }

    /**
     * Remove the first tab.
     */
    function removeFirstTab() {
        vm.removeTab(0);
    }

    /**
     * Remove the tab at the given index.
     *
     * @param {number} index The index of the tab to remove.
     */
    function removeTab(index) {
        if (index < 0 || index >= vm.tabs.length) {
            return;
        }

        vm.tabs.splice(index, 1);
    }

    /////////////////////////////

    vm.addTab = addTab;
    vm.removeFirstTab = removeFirstTab;
    vm.removeTab = removeTab;

    /////////////////////////////

    /**
     * Initialize the controller.
     */
    function init() {
        _tabIndex = vm.tabs.length + 1;
    }

    init();
}

/////////////////////////////

angular.module('design-system').controller('DemoTabsController', DemoTabsController);

/////////////////////////////

export { DemoTabsController };
