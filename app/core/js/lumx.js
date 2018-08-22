(function() {
    'use strict';

    angular.module('lumx.button', []);
    angular.module('lumx.ripple', []);

    angular.module('lumx', [
        'lumx.button',
        'lumx.ripple',
    ]);
})();
