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
    var LxThemeConstant = ['blue', 'yellow', 'red', 'green'];

    /////////////////////////////

    angular.module('lumx.theme').constant('LxThemeConstant', LxThemeConstant);
})();
