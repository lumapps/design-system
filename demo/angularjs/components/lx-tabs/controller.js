import { mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoTabsController() {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    let _tabIndex = 4;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.activeTab = 1;
    vm.icons = {
        mdiPencil,
    };
    vm.isTabDisabled = false;
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

    function addTab() {
        vm.tabs.push({
            content: `Tab ${_tabIndex} content`,
            heading: `Tab ${_tabIndex}`,
        });

        ++_tabIndex;
    }

    function removeFirstTab() {
        vm.removeTab(0);
    }

    function removeTab(_idx) {
        if (vm.tabs.length > _idx) {
            vm.tabs.splice(_idx, 1);
        }
    }

    /////////////////////////////

    vm.addTab = addTab;
    vm.removeFirstTab = removeFirstTab;
    vm.removeTab = removeTab;
}

/////////////////////////////

angular.module('design-system').controller('DemoTabsController', DemoTabsController);

/////////////////////////////

export { DemoTabsController };
