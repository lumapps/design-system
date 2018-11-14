(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxTabsController() {
        var lxTabs = this;

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
        lxTabs.activeTabIndex = 0;

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
         * @param {Object} tab The tab.
         */
        function addTab(tab) {
            lxTabs.tabs.push(tab);
        }

        /**
         * Check if a given tab is active.
         *
         * @param {number}   tab The tab index.
         * @return {boolean} Wether the given tab is active or not.
         */
        function isTabActive(tabIndex) {
            return lxTabs.activeTabIndex === tabIndex;
        }

        /**
         * Set the given tab as active
         *
         * @param {Object} tab The tab.
         */
        function setActiveTab(tab) {
            lxTabs.activeTabIndex = tab.index;
        }

        /////////////////////////////

        lxTabs.addTab = addTab;
        lxTabs.isTabActive = isTabActive;
        lxTabs.setActiveTab = setActiveTab;
    }

    /////////////////////////////

    function lxTabsDirective() {
        return {
            bindToController: true,
            controller: lxTabsController,
            controllerAs: 'lxTabs',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'components/lx-tabs/lx-tabs.html',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.tabs').directive('lxTabs', lxTabsDirective);
})();
