(function IIFE() {
    'use strict';

    /////////////////////////////

    /**
     * The color palette.
     *
     * @type {Array}
     * @constant
     * @readonly
     */
    var LxThemeConstant = ['primary', 'secondary', 'blue', 'yellow', 'red', 'green'];

    /////////////////////////////

    angular.module('lumx.theme').constant('LxThemeConstant', LxThemeConstant);
})();
