function LxDialogService($compile, $rootScope, $timeout, LxUtilsService) {
    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Build an alert dialog.
     *
     * @param {string}   title  The alert dialog title.
     * @param {string}   text   The alert dialog text.
     * @param {string}   button The alert dialog button label.
     * @param {Function} cb     The alert box callback with the answer as available parameter.
     */
    function alertDialog(title, text, button, cb) {
        const alertDialogId = LxUtilsService.generateUUID();
        const alertDialogScope = $rootScope.$new(true);

        alertDialogScope.cb = cb;

        const compiledAlertDialog = $compile(
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
                            <lx-button ng-click="cb()" lx-dialog-close>${button}</lx-button>
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
    function closeDialog(dialogId, canceled, params) {
        $rootScope.$broadcast('lx-dialog__close', dialogId, canceled, params);
    }

    /**
     * Build a confirm dialog.
     *
     * @param {string}   title   The confirm dialog title.
     * @param {string}   text    The confirm dialog text.
     * @param {string}   buttons The confirm dialog buttons label.
     * @param {Function} cb      The confirm dialog callback with the answer as available parameter.
     */
    function confirmDialog(title, text, buttons, cb) {
        const confirmDialogId = LxUtilsService.generateUUID();
        const confirmDialogScope = $rootScope.$new(true);

        confirmDialogScope.cb = cb;

        const compiledConfirmDialog = $compile(
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
                            <lx-button lx-type="secondary" ng-click="cb(false)" lx-dialog-close>
                                ${buttons.cancel}
                            </lx-button>
                            <lx-button class="ml" ng-click="cb(true)" lx-dialog-close>
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
     * @param {string} dialogId The dialog identifier.
     * @param {Object} params   An optional object that holds extra parameters.
     */
    function openDialog(dialogId, params) {
        $rootScope.$broadcast('lx-dialog__open', dialogId, params);
    }

    /////////////////////////////

    service.alert = alertDialog;
    service.close = closeDialog;
    service.confirm = confirmDialog;
    service.open = openDialog;
}

/////////////////////////////

angular.module('lumx.dialog').service('LxDialogService', LxDialogService);

/////////////////////////////

export { LxDialogService };
