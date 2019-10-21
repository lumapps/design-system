/* eslint-disable global-require, import/no-commonjs, import/max-dependencies */

import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { changeTheme, setDemoCustomColors } from '../utils';
import { DEFAULT_THEME, THEMES } from '../constants';

/////////////////////////////

/**
 * The dependencies of the AngularJS application.
 *
 * @type {Array<string>}
 * @constant
 * @readonly
 */
const DEPENDENCIES = [MODULE_NAME, 'ui.router', 'hljs', 'hc.marked'];

/////////////////////////////

function AppDefaultConfig($locationProvider, $stateProvider, markedProvider) {
    $locationProvider.html5Mode({
        enabled: true,
    });

    markedProvider.setOptions({ breaks: true, gfm: true });

    $stateProvider
        .state({
            name: 'app',
            url: '/',
            views: {
                'main-nav': {
                    controller: 'MainNavController',
                    controllerAs: 'vm',
                    template: require('./layout/main-nav/main-nav.html'),
                },
            },
        })
        .state('app.product', {
            abstract: true,
        })
        .state('app.product.foundations', {
            abstract: true,
        })
        .state('app.product.foundations.colors', {
            url: 'colors',
            views: {
                'main@': {
                    controller: 'DemoColorsController',
                    controllerAs: 'vm',
                    template: require('./foundations/colors/demo.html'),
                },
            },
        })
        .state('app.product.foundations.typography', {
            url: 'typography',
            views: {
                'main@': {
                    template: require('./foundations/typography/demo.html'),
                },
            },
        })
        .state('app.product.components', {
            abstract: true,
        })
        .state('app.product.components.avatar', {
            url: 'avatar',
            views: {
                'main@': {
                    controller: 'DemoAvatarController',
                    controllerAs: 'vm',
                    template: require('./components/avatar/demo.html'),
                },
            },
        })
        .state('app.product.components.button', {
            url: 'button',
            views: {
                'main@': {
                    controller: 'DemoButtonController',
                    controllerAs: 'vm',
                    template: require('./components/button/demo.html'),
                },
            },
        })
        .state('app.product.components.checkbox', {
            url: 'checkbox',
            views: {
                'main@': {
                    controller: 'DemoCheckboxController',
                    controllerAs: 'vm',
                    template: require('./components/checkbox/demo.html'),
                },
            },
        })
        .state('app.product.components.chip', {
            url: 'chip',
            views: {
                'main@': {
                    controller: 'DemoChipController',
                    controllerAs: 'vm',
                    template: require('./components/chip/demo.html'),
                },
            },
        })
        .state('app.product.components.comment-block', {
            url: 'comment-block',
            views: {
                'main@': {
                    controller: 'DemoCommentBlockController',
                    controllerAs: 'vm',
                    template: require('./components/comment-block/demo.html'),
                },
            },
        })
        .state('app.product.components.dialog', {
            url: 'dialog',
            views: {
                'main@': {
                    controller: 'DemoDialogController',
                    controllerAs: 'vm',
                    template: require('./components/dialog/demo.html'),
                },
            },
        })
        .state('app.product.components.dropdown', {
            url: 'dropdown',
            views: {
                'main@': {
                    controller: 'DemoDropdownController',
                    controllerAs: 'vm',
                    template: require('./components/dropdown/demo.html'),
                },
            },
        })
        .state('app.product.components.editable-media', {
            url: 'editable-media',
            views: {
                'main@': {
                    controller: 'DemoEditableMediaController',
                    controllerAs: 'vm',
                    template: require('./components/editable-media/demo.html'),
                },
            },
        })
        .state('app.product.components.expansion-panel', {
            url: 'expansion-panel',
            views: {
                'main@': {
                    controller: 'DemoExpansionPanelController',
                    controllerAs: 'vm',
                    template: require('./components/expansion-panel/demo.html'),
                },
            },
        })
        .state('app.product.components.grid', {
            url: 'grid',
            views: {
                'main@': {
                    template: require('./components/grid/demo.html'),
                },
            },
        })
        .state('app.product.components.image-block', {
            url: 'image-block',
            views: {
                'main@': {
                    controller: 'DemoImageBlockController',
                    controllerAs: 'vm',
                    template: require('./components/image-block/demo.html'),
                },
            },
        })
        .state('app.product.components.lightbox', {
            url: 'lightbox',
            views: {
                'main@': {
                    controller: 'DemoLightboxController',
                    controllerAs: 'vm',
                    template: require('./components/lightbox/demo.html'),
                },
            },
        })
        .state('app.product.components.list', {
            url: 'list',
            views: {
                'main@': {
                    controller: 'DemoListController',
                    controllerAs: 'vm',
                    template: require('./components/list/demo.html'),
                },
            },
        })
        .state('app.product.components.notification', {
            url: 'notification',
            views: {
                'main@': {
                    controller: 'DemoNotificationController',
                    controllerAs: 'vm',
                    template: require('./components/notification/demo.html'),
                },
            },
        })
        .state('app.product.components.popover', {
            url: 'popover',
            views: {
                'main@': {
                    controller: 'DemoPopoverController',
                    controllerAs: 'vm',
                    template: require('./components/popover/demo.html'),
                },
            },
        })
        .state('app.product.components.post-block', {
            url: 'post-block',
            views: {
                'main@': {
                    controller: 'DemoPostBlockController',
                    controllerAs: 'vm',
                    template: require('./components/post-block/demo.html'),
                },
            },
        })
        .state('app.product.components.progress', {
            url: 'progress',
            views: {
                'main@': {
                    template: require('./components/progress/demo.html'),
                },
            },
        })
        .state('app.product.components.progress-tracker', {
            url: 'progress-tracker',
            views: {
                'main@': {
                    controller: 'DemoProgressTrackerController',
                    controllerAs: 'vm',
                    template: require('./components/progress-tracker/demo.html'),
                },
            },
        })
        .state('app.product.components.radio-button', {
            url: 'radio-button',
            views: {
                'main@': {
                    controller: 'DemoRadioButtonController',
                    controllerAs: 'vm',
                    template: require('./components/radio-button/demo.html'),
                },
            },
        })
        .state('app.product.components.select', {
            url: 'select',
            views: {
                'main@': {
                    controller: 'DemoSelectController',
                    controllerAs: 'vm',
                    template: require('./components/select/demo.html'),
                },
            },
        })
        .state('app.product.components.side-navigation', {
            url: 'side-navigation',
            views: {
                'main@': {
                    controller: 'DemoSideNavigationController',
                    controllerAs: 'vm',
                    template: require('./components/side-navigation/demo.html'),
                },
            },
        })
        .state('app.product.components.slideshow', {
            url: 'slideshow',
            views: {
                'main@': {
                    controller: 'DemoSlideshowController',
                    controllerAs: 'vm',
                    template: require('./components/slideshow/demo.html'),
                },
            },
        })
        .state('app.product.components.switch', {
            url: 'switch',
            views: {
                'main@': {
                    controller: 'DemoSwitchController',
                    controllerAs: 'vm',
                    template: require('./components/switch/demo.html'),
                },
            },
        })
        .state('app.product.components.table', {
            url: 'table',
            views: {
                'main@': {
                    controller: 'DemoTableController',
                    controllerAs: 'vm',
                    template: require('./components/table/demo.html'),
                },
            },
        })
        .state('app.product.components.tabs', {
            url: 'tabs',
            views: {
                'main@': {
                    controller: 'DemoTabsController',
                    controllerAs: 'vm',
                    template: require('./components/tabs/demo.html'),
                },
            },
        })
        .state('app.product.components.text-field', {
            url: 'text-field',
            views: {
                'main@': {
                    controller: 'DemoTextFieldController',
                    controllerAs: 'vm',
                    template: require('./components/text-field/demo.html'),
                },
            },
        })
        .state('app.product.components.thumbnail', {
            url: 'thumbnail',
            views: {
                'main@': {
                    template: require('./components/thumbnail/demo.html'),
                },
            },
        })
        .state('app.product.components.toolbar', {
            url: 'toolbar',
            views: {
                'main@': {
                    controller: 'DemoToolbarController',
                    controllerAs: 'vm',
                    template: require('./components/toolbar/demo.html'),
                },
            },
        })
        .state('app.product.components.tooltip', {
            url: 'tooltip',
            views: {
                'main@': {
                    template: require('./components/tooltip/demo.html'),
                },
            },
        })
        .state('app.product.components.user-block', {
            url: 'user-block',
            views: {
                'main@': {
                    controller: 'DemoUserBlockController',
                    controllerAs: 'vm',
                    template: require('./components/user-block/demo.html'),
                },
            },
        });
}

AppDefaultConfig.$inject = ['$locationProvider', '$stateProvider', 'markedProvider'];

function AppDefaultRun($rootScope, Theme) {
    $rootScope.Theme = Theme;
    changeTheme(Theme.theme).then(() => {
        $rootScope.$apply(() => {
            Theme.loaded = true;
        });

        setDemoCustomColors(Theme.theme);
    });

    /**
     * Prevent scroll on main areas of the app.
     *
     * @param {Event} evt The scroll event.
     */
    function scrollHandler(evt) {
        evt.preventDefault();
    }

    $rootScope.$on('lumx-scroll__disable', () => {
        angular.element('.main-nav, .main').on('mousewheel touchmove', scrollHandler);
    });

    $rootScope.$on('lumx-scroll__restore', () => {
        angular.element('.main-nav, .main').off('mousewheel touchmove', scrollHandler);
    });
}

AppDefaultRun.$inject = ['$rootScope', 'Theme'];

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
require('./layout/demo/demo-block_directive.js');
require('./layout/demo/demo-colors_directive.js');
require('./layout/demo/demo-grid_directive.js');
require('./layout/main/main-header_directive.js');
require('./layout/main/main-content_directive.js');
require('./layout/main-nav/main-nav_controller.js');

require('./foundations/colors/controller.js');
require('./components/avatar/controller.js');
require('./components/button/controller.js');
require('./components/checkbox/controller.js');
require('./components/chip/controller.js');
require('./components/comment-block/controller.js');
require('./components/dialog/controller.js');
require('./components/dropdown/controller.js');
require('./components/editable-media/controller.js');
require('./components/expansion-panel/controller.js');
require('./components/image-block/controller.js');
require('./components/lightbox/controller.js');
require('./components/list/controller.js');
require('./components/notification/controller.js');
require('./components/popover/controller.js');
require('./components/post-block/controller.js');
require('./components/progress-tracker/controller.js');
require('./components/radio-button/controller.js');
require('./components/select/controller.js');
require('./components/side-navigation/controller.js');
require('./components/slideshow/controller.js');
require('./components/switch/controller.js');
require('./components/table/controller.js');
require('./components/tabs/controller.js');
require('./components/text-field/controller.js');
require('./components/toolbar/controller.js');
require('./components/user-block/controller.js');
/* eslint-enable import/no-unassigned-import */
