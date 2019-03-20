/* eslint-disable global-require, import/no-commonjs, import/max-dependencies */

import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { changeTheme as _changeTheme } from '../utils';
import { DEFAULT_THEME, THEMES } from '../constants';

/////////////////////////////

/**
 * The dependencies of the AngularJS application.
 *
 * @type {Array<string>}
 * @constant
 * @readonly
 */
const DEPENDENCIES = [MODULE_NAME, 'ui.router', 'hljs'];

/////////////////////////////

function AppDefaultConfig($locationProvider, $stateProvider) {
    $locationProvider.html5Mode({
        enabled: true,
    });

    $stateProvider
        .state({
            name: 'app',
            url: '/',
            views: {
                'main-nav': {
                    template: require('./layout/main-nav/main-nav.html'),
                },
                'sub-nav': {
                    controller: 'SubNavController',
                    controllerAs: 'vm',
                    template: require('./layout/sub-nav/sub-nav.html'),
                },
            },
        })
        .state('app.button', {
            url: 'button',
            views: {
                'main@': {
                    controller: 'DemoButtonController',
                    controllerAs: 'vm',
                    template: require('./components/button/demo.html'),
                },
            },
        })
        .state('app.checkbox', {
            url: 'checkbox',
            views: {
                'main@': {
                    controller: 'DemoCheckboxController',
                    controllerAs: 'vm',
                    template: require('./components/checkbox/demo.html'),
                },
            },
        })
        .state('app.chip', {
            url: 'chip',
            views: {
                'main@': {
                    controller: 'DemoChipController',
                    controllerAs: 'vm',
                    template: require('./components/chip/demo.html'),
                },
            },
        })
        .state('app.data-table', {
            url: 'data-table',
            views: {
                'main@': {
                    controller: 'DemoDataTableController',
                    controllerAs: 'vm',
                    template: require('./components/data-table/demo.html'),
                },
            },
        })
        .state('app.dialog', {
            url: 'dialog',
            views: {
                'main@': {
                    controller: 'DemoDialogController',
                    controllerAs: 'vm',
                    template: require('./components/dialog/demo.html'),
                },
            },
        })
        .state('app.dropdown', {
            url: 'dropdown',
            views: {
                'main@': {
                    controller: 'DemoDropdownController',
                    controllerAs: 'vm',
                    template: require('./components/dropdown/demo.html'),
                },
            },
        })
        .state('app.expansion-panel', {
            url: 'expansion-panel',
            views: {
                'main@': {
                    controller: 'DemoExpansionPanelController',
                    controllerAs: 'vm',
                    template: require('./components/expansion-panel/demo.html'),
                },
            },
        })
        .state('app.image-block', {
            url: 'image-block',
            views: {
                'main@': {
                    template: require('./components/image-block/demo.html'),
                },
            },
        })
        .state('app.list', {
            url: 'list',
            views: {
                'main@': {
                    controller: 'DemoListController',
                    controllerAs: 'vm',
                    template: require('./components/list/demo.html'),
                },
            },
        })
        .state('app.notification', {
            url: 'notification',
            views: {
                'main@': {
                    controller: 'DemoNotificationController',
                    controllerAs: 'vm',
                    template: require('./components/notification/demo.html'),
                },
            },
        })
        .state('app.progress', {
            url: 'progress',
            views: {
                'main@': {
                    template: require('./components/progress/demo.html'),
                },
            },
        })
        .state('app.progress-tracker', {
            url: 'progress-tracker',
            views: {
                'main@': {
                    controller: 'DemoProgressTrackerController',
                    controllerAs: 'vm',
                    template: require('./components/progress-tracker/demo.html'),
                },
            },
        })
        .state('app.radio-button', {
            url: 'radio-button',
            views: {
                'main@': {
                    controller: 'DemoRadioButtonController',
                    controllerAs: 'vm',
                    template: require('./components/radio-button/demo.html'),
                },
            },
        })
        .state('app.select', {
            url: 'select',
            views: {
                'main@': {
                    controller: 'DemoSelectController',
                    controllerAs: 'vm',
                    template: require('./components/select/demo.html'),
                },
            },
        })
        .state('app.switch', {
            url: 'switch',
            views: {
                'main@': {
                    controller: 'DemoSwitchController',
                    controllerAs: 'vm',
                    template: require('./components/switch/demo.html'),
                },
            },
        })
        .state('app.tabs', {
            url: 'tabs',
            views: {
                'main@': {
                    controller: 'DemoTabsController',
                    controllerAs: 'vm',
                    template: require('./components/tabs/demo.html'),
                },
            },
        })
        .state('app.text-field', {
            url: 'text-field',
            views: {
                'main@': {
                    controller: 'DemoTextFieldController',
                    controllerAs: 'vm',
                    template: require('./components/text-field/demo.html'),
                },
            },
        })
        .state('app.toolbar', {
            url: 'toolbar',
            views: {
                'main@': {
                    controller: 'DemoToolbarController',
                    controllerAs: 'vm',
                    template: require('./components/toolbar/demo.html'),
                },
            },
        })
        .state('app.tooltip', {
            url: 'tooltip',
            views: {
                'main@': {
                    template: require('./components/tooltip/demo.html'),
                },
            },
        });
}

AppDefaultConfig.$inject = ['$locationProvider', '$stateProvider'];

function AppDefaultRun($rootScope, $http, $templateCache, Theme) {
    const templatesToCache = [];

    $rootScope.Theme = Theme;
    _changeTheme(Theme.theme).then(() => {
        $rootScope.$apply(() => {
            Theme.loaded = true;
        });
    });

    angular.forEach(templatesToCache, function cacheTemplates(templatePath) {
        $http.get(templatePath).then(function cacheTemplatesSuccess(template) {
            if (angular.isDefinedAndFilled(template)) {
                $templateCache.put(templatePath, template.data);
            }
        });
    });
}

AppDefaultRun.$inject = ['$rootScope', '$http', '$templateCache', 'Theme'];

/////////////////////////////

angular
    .module('design-system', DEPENDENCIES)
    .value('Theme', {
        loaded: false,
        theme: DEFAULT_THEME,
    })
    .constant('Themes', THEMES)
    .config(AppDefaultConfig)
    .run(AppDefaultRun);

/////////////////////////////

/* eslint-disable import/no-unassigned-import */
require('./layout/main/main-header_directive.js');
require('./layout/main/main-block_directive.js');
require('./layout/sub-nav/sub-nav_controller.js');

require('./components/button/controller.js');
require('./components/checkbox/controller.js');
require('./components/chip/controller.js');
require('./components/data-table/controller.js');
require('./components/dialog/controller.js');
require('./components/dropdown/controller.js');
require('./components/expansion-panel/controller.js');
require('./components/list/controller.js');
require('./components/notification/controller.js');
require('./components/progress-tracker/controller.js');
require('./components/radio-button/controller.js');
require('./components/select/controller.js');
require('./components/switch/controller.js');
require('./components/tabs/controller.js');
require('./components/text-field/controller.js');
require('./components/toolbar/controller.js');
/* eslint-enable import/no-unassigned-import */
