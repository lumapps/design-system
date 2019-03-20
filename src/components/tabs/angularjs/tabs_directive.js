import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './tabs.html';

/////////////////////////////

function TabsController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The lactive tab index.
     *
     * @type {number}
     */
    lumx.activeTab = angular.isDefined(lumx.activeTab) ? lumx.activeTab : 0;

    /**
     * The list of tabs.
     *
     * @type {Array}
     */
    lumx.tabs = [];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Add a tab to the list of tabs.
     *
     * @param {Object} tabToAdd The tab to add.
     */
    function addTab(tabToAdd) {
        lumx.tabs.push(tabToAdd);
    }

    /**
     * Check if a given tab is active.
     *
     * @param  {number}  tabIndex The tab index.
     * @return {boolean} Whether the given tab is active or not.
     */
    function isTabActive(tabIndex) {
        return lumx.activeTab === tabIndex;
    }

    /**
     * Remove the given tab.
     *
     * @param {Object} tabToRemove The tab to remove.
     */
    function removeTab(tabToRemove) {
        lumx.tabs.splice(tabToRemove.index, 1);

        angular.forEach(lumx.tabs, (tab, index) => {
            tab.index = index;
        });

        if (lumx.tabs.length > 0) {
            lumx.setActiveTab(lumx.tabs[0]);
        }
    }

    /**
     * Set the given tab as active.
     *
     * @param {Object} tab The tab.
     */
    function setActiveTab(tab) {
        if (tab.isDisabled) {
            return;
        }

        lumx.activeTab = tab.index;
    }

    /**
     * Update the given tab.
     *
     * @param {Object} updatedTab The tab to update.
     */
    function updateTab(updatedTab) {
        angular.forEach(lumx.tabs, (tab) => {
            if (tab.uuid === updatedTab.uuid) {
                tab = updatedTab;
            }
        });
    }

    /////////////////////////////

    lumx.addTab = addTab;
    lumx.isTabActive = isTabActive;
    lumx.removeTab = removeTab;
    lumx.setActiveTab = setActiveTab;
    lumx.updateTab = updateTab;
}

/////////////////////////////

function TabsDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TabsController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            activeTab: '=?lxActiveTab',
            layout: '@?lxLayout',
            position: '@?lxPosition',
            theme: '@?lxTheme',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.tabs`).directive(`${COMPONENT_PREFIX}Tabs`, TabsDirective);

/////////////////////////////

export { TabsDirective };
