import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-tab.html';

/////////////////////////////

function TabController($scope, NglxUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

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
    lumx.tab = {};

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
        return _parentController.isTabActive(lumx.tab.index);
    }

    /**
     * Register the tab to the parent controller at init.
     *
     * @param {Object} parentController The parent controller.
     * @param {number} tabIndex         The tab index.
     */
    function registerTab(parentController, tabIndex) {
        _parentController = parentController;

        lumx.tab = {
            icon: lumx.icon,
            index: tabIndex,
            label: lumx.label,
            uuid: NglxUtilsService.generateUUID(),
        };

        _parentController.addTab(lumx.tab);
    }

    /////////////////////////////

    lumx.isTabActive = isTabActive;
    lumx.registerTab = registerTab;

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
    $scope.$watch('lumx.isDisabled', function isDisableddWatcher(isDisabled) {
        lumx.tab.isDisabled = isDisabled;

        _parentController.updateTab(lumx.tab);
    });

    /**
     * Remove the current tab on destroy.
     */
    $scope.$on('$destroy', () => {
        _parentController.removeTab(lumx.tab);
    });
}

/////////////////////////////

function TabDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls) {
        ctrls[0].registerTab(ctrls[1], el.index());
    }

    return {
        bindToController: true,
        controller: TabController,
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}Tab`, `^${COMPONENT_PREFIX}Tabs`],
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

angular.module(`${MODULE_NAME}.tabs`).directive(`${COMPONENT_PREFIX}Tab`, TabDirective);

/////////////////////////////

export { TabDirective };
