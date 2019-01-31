(function IIFE() {
    'use strict';

    /////////////////////////////

    LxDialogService.$inject = ['$rootScope'];

    function LxDialogService($rootScope) {
        var service = this;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Close a given dialog.
         *
         * @param {string}  dialogId The dialog identifier.
         * @param {boolean} canceled Wether the dialog is closed via a cancel or not.
         * @param {Object}  params   An optional object that holds extra parameters.
         */
        function close(dialogId, canceled, params) {
            $rootScope.$broadcast('lx-dialog__close', dialogId, canceled, params);
        }

        /**
         * Open a given dialog.
         *
         * @param {string}  dialogId The dialog identifier.
         * @param {Object}  params   An optional object that holds extra parameters.
         */
        function open(dialogId, params) {
            $rootScope.$broadcast('lx-dialog__open', dialogId, params);
        }

        /////////////////////////////

        service.close = close;
        service.open = open;
    }

    /////////////////////////////

    angular.module('lumx.dialog').service('LxDialogService', LxDialogService);
})();
