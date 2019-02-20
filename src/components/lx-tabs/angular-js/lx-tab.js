import template from './lx-tab.html';

/////////////////////////////

function lxTabController($scope, LxUtilsService) {
    // eslint-disable-next-line consistent-this
    const lxTab = this;

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
    let _parentController;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The current tab properties.
     *
     * @type {Object}
     */
    lxTab.tab = {};

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Check if the current tab is active.
     *
     * @return {boolean} Whether the current tab is active or not.
     */
    function isTabActive() {
        return _parentController.isTabActive(lxTab.tab.index);
    }

    /**
     * Register the tab to the parent controller at init.
     *
     * @param {Object} parentController The parent controller.
     * @param {number} tabIndex         The tab index.
     */
    function registerTab(parentController, tabIndex) {
        _parentController = parentController;

        lxTab.tab = {
            icon: lxTab.icon,
            index: tabIndex,
            label: lxTab.label,
            uuid: LxUtilsService.generateUUID(),
        };

        _parentController.addTab(lxTab.tab);
    }

    /////////////////////////////

    lxTab.isTabActive = isTabActive;
    lxTab.registerTab = registerTab;

    /////////////////////////////
    //                         //
    //        Watchers         //
    //                         //
    /////////////////////////////

    /**
     * Watch for any changes of the current tab disabled state.
     *
     * @param {boolean} isDisabled Whether the tab is disabled or not.
     */
    $scope.$watch('lxTab.isDisabled', function isDisableddWatcher(isDisabled) {
        lxTab.tab.isDisabled = isDisabled;

        _parentController.updateTab(lxTab.tab);
    });

    /**
     * Remove the current tab on destroy.
     */
    $scope.$on('$destroy', () => {
        _parentController.removeTab(lxTab.tab);
    });
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
        link,
        replace: true,
        require: ['lxTab', '^lxTabs'],
        restrict: 'E',
        scope: {
            icon: '@?lxIcon',
            isDisabled: '=?ngDisabled',
            label: '@?lxLabel',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.tabs').directive('lxTab', lxTabDirective);

/////////////////////////////

export { lxTabDirective };
