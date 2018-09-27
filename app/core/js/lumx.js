(function() {
    'use strict';

    angular.module('lumx.utils.depth', []);
    angular.module('lumx.utils.utils', []);

    angular.module('lumx.utils', [
        'lumx.utils.depth',
        'lumx.utils.utils',
    ]);

    angular.module('lumx.button', []);
    angular.module('lumx.checkbox', []);
    angular.module('lumx.icon-button', []);
    angular.module('lumx.menu', []);
    angular.module('lumx.ripple', []);
    angular.module('lumx.select', []);
    angular.module('lumx.text-field', []);

    angular.module('lumx', [
        'lumx.button',
        'lumx.checkbox',
        'lumx.icon-button',
        'lumx.menu',
        'lumx.ripple',
        'lumx.select',
        'lumx.text-field',
        'lumx.utils',
    ]);
})();
