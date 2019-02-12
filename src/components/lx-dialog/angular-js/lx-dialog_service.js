(function IIFE() {
    'use strict';

    /////////////////////////////

    LxDialogService.$inject = ['$compile', '$rootScope', '$timeout', 'LxUtilsService'];

    function LxDialogService($compile, $rootScope, $timeout, LxUtilsService) {
        var service = this;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Build an alert dialog.
         *
         * @param {string}   title    The alert dialog title.
         * @param {string}   text     The alert dialog text.
         * @param {string}   button   The alert dialog button label.
         * @param {Function} callback The alert box callback with the answer as available parameter (always true for the alert box).
         */
        function alert(title, text, button, callback) {
            var alertDialogId = LxUtilsService.generateUUID();
            var alertDialogScope = $rootScope.$new(true);

            alertDialogScope.callback = callback;

            var compiledAlertDialog = $compile(
                `<lx-dialog id="${alertDialogId}" lx-auto-close="false" lx-escape-close="false">
                    <lx-dialog-header>
                        <div class="p++">
                            <span class="lx-typography-title">${title}</span>
                        </div>
                    </lx-dialog-header>
                    <lx-dialog-content>
                        <div class="ph++">
                            <p>${text}</p>
                        </div>
                    </lx-dialog-content>
                    <lx-dialog-footer>
                        <div class="p++" lx-grid-container="row" lx-grid-h-align="center" lx-grid-v-align="right">
                            <lx-button ng-click="callback()" lx-dialog-close>${button}</lx-button>
                        </div>
                    </lx-dialog-footer>
                </lx-dialog>`,
            )(alertDialogScope);

            angular.element('body').append(compiledAlertDialog);

            $timeout(function waitBeforeOpeningAlertDialog() {
                service.open(alertDialogId, { isAlertDialog: true });
            });
        }

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
         * Build a confirm dialog.
         *
         * @param {string}   title    The confirm dialog title.
         * @param {string}   text     The confirm dialog text.
         * @param {string}   buttons  The confirm dialog buttons label.
         * @param {Function} callback The confirm dialog callback with the answer as available parameter.
         */
        function confirm(title, text, buttons, callback) {
            var confirmDialogId = LxUtilsService.generateUUID();
            var confirmDialogScope = $rootScope.$new(true);

            confirmDialogScope.callback = callback;

            var compiledConfirmDialog = $compile(
                `<lx-dialog id="${confirmDialogId}" lx-auto-close="false" lx-escape-close="false">
                    <lx-dialog-header>
                        <div class="p++">
                            <span class="lx-typography-title">${title}</span>
                        </div>
                    </lx-dialog-header>
                    <lx-dialog-content>
                        <div class="ph++">
                            <p>${text}</p>
                        </div>
                    </lx-dialog-content>
                    <lx-dialog-footer>
                        <div class="p++" lx-grid-container="row" lx-grid-h-align="center" lx-grid-v-align="right">
                            <lx-button lx-type="secondary" ng-click="callback(false)" lx-dialog-close>
                                ${buttons.cancel}
                            </lx-button>
                            <lx-button class="ml" ng-click="callback(true)" lx-dialog-close>
                                ${buttons.ok}
                            </lx-button>
                        </div>
                    </lx-dialog-footer>
                </lx-dialog>`,
            )(confirmDialogScope);

            angular.element('body').append(compiledConfirmDialog);

            $timeout(function waitBeforeOpeningAlertDialog() {
                service.open(confirmDialogId, { isConfirmDialog: true });
            });
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

        service.alert = alert;
        service.close = close;
        service.confirm = confirm;
        service.open = open;
    }

    /////////////////////////////

    angular.module('lumx.dialog').service('LxDialogService', LxDialogService);
})();
