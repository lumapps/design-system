(function IIFE() {
    'use strict';

    /////////////////////////////

    function DemoTabsController() {
        var vm = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        var _tabIndex = 4;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        vm.activeTab = 1;
        vm.isTabDisabled = false;
        vm.tabs = [
            {
                heading: 'Tab 1',
                content: 'Tab 1 content',
            },
            {
                heading: 'Tab 2',
                content: 'Tab 2 content',
            },
            {
                heading: 'Tab 3',
                content: 'Tab 3 content',
            },
        ];

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        function addTab() {
            vm.tabs.push({
                heading: 'Tab ' + _tabIndex,
                content: 'Tab ' + _tabIndex + ' content',
            });

            ++_tabIndex;
        }

        function removeFirstTab() {
            removeTab(0);
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
})();
