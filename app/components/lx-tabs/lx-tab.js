(function IIFE() {
    'use strict';

    /////////////////////////////

    lxTabController.$inject = ['LxUtilsService'];

    function lxTabController(LxUtilsService) {
        var lxTab = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The parent controller.
         *
         * @type {Object}
         */
        var _parentController;

         /**
         * The current tab properties.
         *
         * @type {Object}
         */
        var _tab;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Check if the current tab is active.
         *
         * @return {boolean} Wether the current tab is active or not.
         */
        function isTabActive() {
            return _parentController.isTabActive(_tab.index);
        }

        /**
         * Register the tab to the parent controller at init.
         *
         * @param {Object} parentController The parent controller.
         * @param {number} tabIndex The tab index.
         */
        function registerTab(parentController, tabIndex) {
            _parentController = parentController;

            _tab = {
                uuid: LxUtilsService.generateUUID(),
                index: tabIndex,
                label: lxTab.tabLabel,
                icon: lxTab.tabIcon
            };

            _parentController.addTab(_tab);
        }

        /////////////////////////////

        lxTab.isTabActive = isTabActive;
        lxTab.registerTab = registerTab;
    }

    /////////////////////////////

    function lxTabDirective() {
        function link(scope, el, attrs, ctrls) {
            ctrls[0].registerTab(ctrls[1], el.index());
        }

        return {
            bindToController: true,
            controller: lxTabController,
            controllerAs: 'lxTab',
            link: link,
            replace: true,
            restrict: 'E',
            require: ['lxTab', '^lxTabs'],
            scope: {
                tabIcon: '@?lxIcon',
                tabLabel: '@?lxLabel',
            },
            templateUrl: 'components/lx-tabs/lx-tab.html',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.tabs').directive('lxTab', lxTabDirective);
})();
