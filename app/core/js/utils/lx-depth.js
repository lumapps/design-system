(function IIFE() {
    'use strict';

    /////////////////////////////

    function LxDepthService() {
        var service = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The initial depth.
         *
         * @type {integer}
         */
        var _depth = 1000;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        function get() {
            return _depth;
        }

        function increase() {
            _depth++;
        }

        /////////////////////////////

        service.get = get;
        service.increase = increase;
    }

    /////////////////////////////

    angular.module('lumx.utils.depth').service('LxDepth', LxDepthService);
})();
