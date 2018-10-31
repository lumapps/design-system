(function() {
    'use strict';

    angular.module('lumx.utils.depth', []);
    angular.module('lumx.utils.event-scheduler', []);
    angular.module('lumx.utils.utils', []);

    angular.module('lumx.utils', [
        'lumx.utils.depth',
        'lumx.utils.event-scheduler',
        'lumx.utils.utils',
    ]);

    angular.module('lumx.button', []);
    angular.module('lumx.checkbox', []);
    angular.module('lumx.dropdown', []);
    angular.module('lumx.icon-button', []);
    angular.module('lumx.ripple', []);
    angular.module('lumx.select', []);
    angular.module('lumx.text-field', []);

    angular.module('lumx', [
        'lumx.button',
        'lumx.checkbox',
        'lumx.dropdown',
        'lumx.icon-button',
        'lumx.ripple',
        'lumx.select',
        'lumx.text-field',
        'lumx.utils',
    ]);
})();
