import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-tabs.scss';
import template from './lx-tabs.html';

/////////////////////////////

function lxTabsController() {
    // eslint-disable-next-line consistent-this
    const lxTabs = this;

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
    lxTabs.activeTab = angular.isDefined(lxTabs.activeTab) ? lxTabs.activeTab : 0;

    /**
     * The list of tabs.
     *
     * @type {Array}
     */
    lxTabs.tabs = [];

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
        lxTabs.tabs.push(tabToAdd);
    }

    /**
     * Check if a given tab is active.
     *
     * @param  {number}  tabIndex The tab index.
     * @return {boolean} Whether the given tab is active or not.
     */
    function isTabActive(tabIndex) {
        return lxTabs.activeTab === tabIndex;
    }

    /**
     * Remove the given tab.
     *
     * @param {Object} tabToRemove The tab to remove.
     */
    function removeTab(tabToRemove) {
        lxTabs.tabs.splice(tabToRemove.index, 1);

        angular.forEach(lxTabs.tabs, (tab, index) => {
            tab.index = index;
        });

        if (lxTabs.tabs.length > 0) {
            lxTabs.setActiveTab(lxTabs.tabs[0]);
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

        lxTabs.activeTab = tab.index;
    }

    /**
     * Update the given tab.
     *
     * @param {Object} updatedTab The tab to update.
     */
    function updateTab(updatedTab) {
        angular.forEach(lxTabs.tabs, (tab) => {
            if (tab.uuid === updatedTab.uuid) {
                tab = updatedTab;
            }
        });
    }

    /////////////////////////////

    lxTabs.addTab = addTab;
    lxTabs.isTabActive = isTabActive;
    lxTabs.removeTab = removeTab;
    lxTabs.setActiveTab = setActiveTab;
    lxTabs.updateTab = updateTab;
}

/////////////////////////////

function lxTabsDirective() {
    return {
        bindToController: true,
        controller: lxTabsController,
        controllerAs: 'lxTabs',
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

angular.module(`${MODULE_NAME}.tabs`).directive('lxTabs', lxTabsDirective);

/////////////////////////////

export { lxTabsDirective };
