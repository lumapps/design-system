(function() {
    'use strict';

    angular.module('lumx.utils.utils', []);

    angular.module('lumx.utils', [
        'lumx.utils.utils',
    ]);

    angular.module('lumx.button', []);
    angular.module('lumx.checkbox', []);
    angular.module('lumx.icon-button', []);
    angular.module('lumx.ripple', []);

    angular.module('lumx', [
        'lumx.button',
        'lumx.checkbox',
        'lumx.icon-button',
        'lumx.ripple',
        'lumx.utils',
    ]);
})();
