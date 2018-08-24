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
                    templateUrl: 'demo/lx-button/demo.html'
                }
            }
        }).state('app.icon-button', {
            url: 'icon-button',
            views: {
                'main@': {
                    templateUrl: 'demo/lx-icon-button/demo.html'
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
