(function IIFE() {
    'use strict';

    /////////////////////////////

    var DEPENDENCIES = [
        'lumx',
        'ui.router',
    ];

    function AppDefaultConfig($locationProvider, $stateProvider) {
        $locationProvider.html5Mode({
            enabled: true,
        });

        $stateProvider.state({
            name: 'app',
            url: '/',
            views: {
                header: {
                    templateUrl: 'layout/header/header.html',
                },
                sidebar: {
                    templateUrl: 'layout/sidebar/sidebar.html',
                },
            },
        }).state('app.button', {
            url: 'button',
            views: {
                'main@': {
                    templateUrl: 'demo/lx-button/demo.html',
                }
            }
        }).state('app.checkbox', {
            url: 'checkbox',
            views: {
                'main@': {
                    controller: 'DemoCheckboxController',
                    controllerAs: 'vm',
                    templateUrl: 'demo/lx-checkbox/demo.html',
                }
            }
        }).state('app.icon-button', {
            url: 'icon-button',
            views: {
                'main@': {
                    templateUrl: 'demo/lx-icon-button/demo.html',
                }
            }
        }).state('app.menu', {
            url: 'menu',
            views: {
                'main@': {
                    controller: 'DemoMenuController',
                    controllerAs: 'vm',
                    templateUrl: 'demo/lx-menu/demo.html',
                }
            }
        }).state('app.select', {
            url: 'select',
            views: {
                'main@': {
                    controller: 'DemoSelectController',
                    controllerAs: 'vm',
                    templateUrl: 'demo/lx-select/demo.html',
                }
            }
        }).state('app.text-field', {
            url: 'text-field',
            views: {
                'main@': {
                    controller: 'DemoTextFieldController',
                    controllerAs: 'vm',
                    templateUrl: 'demo/lx-text-field/demo.html',
                }
            }
        });
    }

    AppDefaultConfig.$inject = ['$locationProvider', '$stateProvider'];

    function AppDefaultRun($http, $templateCache) {
        var templatesToCache = [];

        angular.forEach(templatesToCache, function cacheTemplates(templatePath) {
            $http.get(templatePath).then(function cacheTemplatesSuccess(template) {
                if (angular.isDefinedAndFilled(template)) {
                    $templateCache.put(templatePath, template.data);
                }
            });
        });
    }

    AppDefaultRun.$inject = ['$http', '$templateCache'];

    angular.module('design-system', DEPENDENCIES).config(AppDefaultConfig).run(AppDefaultRun);
})();
